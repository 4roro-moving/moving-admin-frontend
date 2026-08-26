"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import AdminFeedbackToast from "@/components/admin/common/AdminFeedbackToast";
import AdminReviewCard from "@/components/admin/contents/AdminReviewCard";
import AdminReviewHideReasonModal from "@/components/admin/contents/AdminReviewHideReasonModal";
import {
  AdminReviewEmptyState,
  AdminReviewErrorState,
  AdminReviewLoadingState,
} from "@/components/admin/contents/AdminReviewListStates";
import AdminReviewPagination from "@/components/admin/contents/AdminReviewPagination";
import AdminReviewSearchBar from "@/components/admin/contents/AdminReviewSearchBar";
import AdminReviewSortChips from "@/components/admin/contents/AdminReviewSortChips";
import { useAdminFeedbackToast } from "@/hooks/common/useAdminFeedbackToast";
import { useAdminReviewModeration } from "@/hooks/useAdminReviewModeration";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { ADMIN_REVIEW_LIST_PAGE_LIMIT } from "@/lib/api/adminReviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { isValidHideReason } from "@/lib/utils/adminReview";
import type { AdminReviewItem, AdminReviewSort } from "@/types/adminReview";

interface HideReasonModalState {
  review: AdminReviewItem;
}

interface ModerationFeedback {
  tone: "error" | "success";
  message: string;
}

export default function AdminContentsReviewsPage() {
  const [page, setPage] = useState(1);
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<AdminReviewSort>("LATEST");
  const [reasonModal, setReasonModal] = useState<HideReasonModalState | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [feedback, showFeedback] = useAdminFeedbackToast<ModerationFeedback>();

  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const listQuery = useMemo(
    () => ({
      page,
      limit: ADMIN_REVIEW_LIST_PAGE_LIMIT,
      sort,
      keyword: keyword || undefined,
    }),
    [keyword, page, sort],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useAdminReviews(listQuery);
  const { hideMutation, unhideMutation, isPending } = useAdminReviewModeration();

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const handleSubmitSearch = () => {
    setKeyword(keywordInput.trim());
    setPage(1);
  };

  const restoreFocus = useCallback(() => {
    previouslyFocusedElementRef.current?.focus();
    previouslyFocusedElementRef.current = null;
  }, []);

  const openHideReasonModal = (review: AdminReviewItem) => {
    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    showFeedback(null);
    setReasonModal({ review });
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
        reviewId: reasonModal.review.id,
        reason: trimmedReason,
      });
      setReasonModal(null);
      setReasonInput("");
      restoreFocus();
      showFeedback({ tone: "success", message: "리뷰를 숨김 처리했습니다." });
    } catch {
      // 실패 시 모달이 열린 채로 hideMutation.error를 표시하므로 토스트는 중복하지 않는다.
    }
  };

  const handleUnhide = async (review: AdminReviewItem) => {
    if (isPending) {
      return;
    }

    showFeedback(null);

    try {
      await unhideMutation.mutateAsync({ reviewId: review.id });
      showFeedback({ tone: "success", message: "리뷰를 복구했습니다." });
    } catch (unhideException) {
      showFeedback({
        tone: "error",
        message: getApiErrorMessage(unhideException, "복구 처리에 실패했습니다."),
      });
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">리뷰 관리</h1>
        <p className="text-muted text-sm">
          작성자·키워드 검색, 정렬, 숨김/복구 및 처리 사유 기록을 관리합니다.
        </p>
      </header>

      <AdminReviewSearchBar
        value={keywordInput}
        onChange={setKeywordInput}
        onSubmit={handleSubmitSearch}
      />

      <AdminReviewSortChips
        value={sort}
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
            {items.map((review) => (
              <AdminReviewCard
                key={review.id}
                review={review}
                disabled={isPending}
                onHide={openHideReasonModal}
                onUnhide={(target) => {
                  void handleUnhide(target);
                }}
              />
            ))}
          </div>

          {items.length === 0 ? <AdminReviewEmptyState /> : null}

          {pagination ? (
            <AdminReviewPagination pagination={pagination} onChangePage={setPage} />
          ) : null}
        </>
      ) : null}

      {reasonModal ? (
        <AdminReviewHideReasonModal
          authorName={reasonModal.review.author.name}
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
        <AdminFeedbackToast tone={feedback.tone} message={feedback.message} />
      ) : null}

      {!feedback && isFetching && !isLoading ? (
        <AdminFeedbackToast tone="info" message="목록을 갱신 중입니다." />
      ) : null}
    </section>
  );
}
