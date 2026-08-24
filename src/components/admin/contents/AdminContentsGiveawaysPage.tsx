"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import AdminGiveawayCard from "@/components/admin/contents/AdminGiveawayCard";
import AdminReviewHideReasonModal from "@/components/admin/contents/AdminReviewHideReasonModal";
import {
  AdminReviewEmptyState,
  AdminReviewErrorState,
  AdminReviewFeedbackToast,
  AdminReviewLoadingState,
} from "@/components/admin/contents/AdminReviewListStates";
import AdminReviewPagination from "@/components/admin/contents/AdminReviewPagination";
import AdminReviewSearchBar from "@/components/admin/contents/AdminReviewSearchBar";
import AdminReviewSortChips from "@/components/admin/contents/AdminReviewSortChips";
import { useAdminGiveawayModeration } from "@/hooks/useAdminGiveawayModeration";
import { useAdminGiveaways } from "@/hooks/useAdminGiveaways";
import {
  ADMIN_GIVEAWAY_LIST_PAGE_LIMIT,
  ADMIN_GIVEAWAY_SORT_OPTIONS,
} from "@/lib/constants/adminGiveaways";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { isValidHideReason } from "@/lib/utils/adminReview";
import type { AdminGiveawayItem, AdminGiveawaySort } from "@/types/adminGiveaway";

interface HideReasonModalState {
  giveaway: AdminGiveawayItem;
}

interface ModerationFeedback {
  tone: "error" | "success";
  message: string;
}

export default function AdminContentsGiveawaysPage() {
  const [page, setPage] = useState(1);
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<AdminGiveawaySort>("LATEST");
  const [reasonModal, setReasonModal] = useState<HideReasonModalState | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [feedback, setFeedback] = useState<ModerationFeedback | null>(null);

  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const listQuery = useMemo(
    () => ({
      page,
      limit: ADMIN_GIVEAWAY_LIST_PAGE_LIMIT,
      sort,
      keyword: keyword || undefined,
    }),
    [keyword, page, sort],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useAdminGiveaways(listQuery);
  const { hideMutation, unhideMutation, isPending } = useAdminGiveawayModeration();

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFeedback(null);
    }, 3200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [feedback]);

  const handleSubmitSearch = () => {
    setKeyword(keywordInput.trim());
    setPage(1);
  };

  const restoreFocus = useCallback(() => {
    previouslyFocusedElementRef.current?.focus();
    previouslyFocusedElementRef.current = null;
  }, []);

  const openHideReasonModal = (giveaway: AdminGiveawayItem) => {
    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setFeedback(null);
    setReasonModal({ giveaway });
    setReasonInput("");
  };

  const closeReasonModal = useCallback(() => {
    if (hideMutation.isPending) {
      return;
    }
    setReasonModal(null);
    setReasonInput("");
    restoreFocus();
  }, [hideMutation.isPending, restoreFocus]);

  const handleConfirmHide = async () => {
    if (!reasonModal) return;

    const trimmedReason = reasonInput.trim();
    if (!isValidHideReason(trimmedReason)) {
      return;
    }

    try {
      await hideMutation.mutateAsync({
        giveawayId: reasonModal.giveaway.id,
        reason: trimmedReason,
      });
      setReasonModal(null);
      setReasonInput("");
      restoreFocus();
      setFeedback({ tone: "success", message: "나눔 게시물을 숨김 처리했습니다." });
    } catch {
      // 실패 시 모달이 열린 채로 hideMutation.error를 표시하므로 토스트는 중복하지 않는다.
    }
  };

  const handleUnhide = async (giveaway: AdminGiveawayItem) => {
    if (isPending) {
      return;
    }

    setFeedback(null);

    try {
      await unhideMutation.mutateAsync({ giveawayId: giveaway.id });
      setFeedback({ tone: "success", message: "나눔 게시물을 복구했습니다." });
    } catch (unhideException) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(unhideException, "복구 처리에 실패했습니다."),
      });
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">나눔 관리</h1>
        <p className="text-muted text-sm">
          작성자·키워드 검색, 정렬, 숨김/복구 및 처리 사유 기록을 관리합니다.
        </p>
      </header>

      <AdminReviewSearchBar
        value={keywordInput}
        onChange={setKeywordInput}
        onSubmit={handleSubmitSearch}
        inputId="admin-giveaway-search"
      />

      <AdminReviewSortChips
        value={sort}
        options={ADMIN_GIVEAWAY_SORT_OPTIONS}
        onChange={(nextSort) => {
          setSort(nextSort);
          setPage(1);
        }}
      />

      {isLoading ? <AdminReviewLoadingState /> : null}

      {isError ? (
        <AdminReviewErrorState
          error={error}
          onRetry={() => {
            void refetch();
          }}
        />
      ) : null}

      {!isLoading && !isError ? (
        <>
          <div className="flex flex-col gap-3">
            {items.map((giveaway) => (
              <AdminGiveawayCard
                key={giveaway.id}
                giveaway={giveaway}
                disabled={isPending}
                onHide={openHideReasonModal}
                onUnhide={(target) => {
                  void handleUnhide(target);
                }}
              />
            ))}
          </div>

          {items.length === 0 ? (
            <AdminReviewEmptyState message="조건에 맞는 나눔 게시물이 없습니다." />
          ) : null}

          {pagination ? (
            <AdminReviewPagination pagination={pagination} onChangePage={setPage} />
          ) : null}
        </>
      ) : null}

      {reasonModal ? (
        <AdminReviewHideReasonModal
          authorName={reasonModal.giveaway.author.name}
          reason={reasonInput}
          isPending={hideMutation.isPending}
          error={hideMutation.isError ? hideMutation.error : null}
          onReasonChange={setReasonInput}
          onClose={closeReasonModal}
          onConfirm={() => {
            void handleConfirmHide();
          }}
        />
      ) : null}

      {feedback ? (
        <AdminReviewFeedbackToast tone={feedback.tone} message={feedback.message} />
      ) : null}

      {!feedback && isFetching && !isLoading ? (
        <AdminReviewFeedbackToast tone="info" message="목록을 갱신 중입니다." />
      ) : null}
    </section>
  );
}
