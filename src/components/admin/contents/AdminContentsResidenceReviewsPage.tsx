"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import AdminResidenceReviewCard from "@/components/admin/contents/AdminResidenceReviewCard";
import AdminReviewHideReasonModal from "@/components/admin/contents/AdminReviewHideReasonModal";
import {
  AdminReviewEmptyState,
  AdminReviewFeedbackToast,
} from "@/components/admin/contents/AdminReviewListStates";
import AdminReviewPagination from "@/components/admin/contents/AdminReviewPagination";
import AdminReviewSearchBar from "@/components/admin/contents/AdminReviewSearchBar";
import AdminReviewSortChips from "@/components/admin/contents/AdminReviewSortChips";
import {
  ADMIN_RESIDENCE_REVIEW_LIST_PAGE_LIMIT,
  ADMIN_RESIDENCE_REVIEW_SORT_OPTIONS,
} from "@/lib/constants/adminResidenceReviews";
import { isValidHideReason } from "@/lib/utils/adminReview";
import {
  listMockAdminResidenceReviews,
  MOCK_ADMIN_RESIDENCE_REVIEWS,
} from "@/mocks/adminResidenceReviewsMock";
import type {
  AdminResidenceReviewItem,
  AdminResidenceReviewSort,
} from "@/types/adminResidenceReview";

interface HideReasonModalState {
  review: AdminResidenceReviewItem;
}

interface ModerationFeedback {
  tone: "error" | "success";
  message: string;
}

export default function AdminContentsResidenceReviewsPage() {
  const [items, setItems] = useState<AdminResidenceReviewItem[]>(() =>
    structuredClone(MOCK_ADMIN_RESIDENCE_REVIEWS),
  );
  const [page, setPage] = useState(1);
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<AdminResidenceReviewSort>("LATEST");
  const [reasonModal, setReasonModal] = useState<HideReasonModalState | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<ModerationFeedback | null>(null);

  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const listResult = useMemo(
    () =>
      listMockAdminResidenceReviews({
        page,
        limit: ADMIN_RESIDENCE_REVIEW_LIST_PAGE_LIMIT,
        sort,
        keyword: keyword || undefined,
        items,
      }),
    [items, keyword, page, sort],
  );

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

  const openHideReasonModal = (review: AdminResidenceReviewItem) => {
    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setFeedback(null);
    setReasonModal({ review });
    setReasonInput("");
  };

  const closeReasonModal = useCallback(() => {
    if (isPending) {
      return;
    }
    setReasonModal(null);
    setReasonInput("");
    restoreFocus();
  }, [isPending, restoreFocus]);

  const handleConfirmHide = () => {
    if (!reasonModal) return;

    const trimmedReason = reasonInput.trim();
    if (!isValidHideReason(trimmedReason)) {
      return;
    }

    setIsPending(true);
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) =>
        item.id === reasonModal.review.id
          ? {
              ...item,
              isHidden: true,
              updatedAt: now,
              latestModeration: {
                action: "HIDE",
                reason: trimmedReason,
                adminName: "관리자",
                createdAt: now,
              },
            }
          : item,
      ),
    );
    setReasonModal(null);
    setReasonInput("");
    setIsPending(false);
    restoreFocus();
    setFeedback({ tone: "success", message: "거주후기를 숨김 처리했습니다." });
  };

  const handleUnhide = (review: AdminResidenceReviewItem) => {
    if (isPending) {
      return;
    }

    setFeedback(null);
    setIsPending(true);
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) =>
        item.id === review.id
          ? {
              ...item,
              isHidden: false,
              updatedAt: now,
              latestModeration: {
                action: "UNHIDE",
                reason: null,
                adminName: "관리자",
                createdAt: now,
              },
            }
          : item,
      ),
    );
    setIsPending(false);
    setFeedback({ tone: "success", message: "거주후기를 복구했습니다." });
  };

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">거주 후기 관리</h1>
        <p className="text-muted text-sm">
          작성자·키워드 검색, 정렬, 숨김/복구 및 처리 사유 기록을 관리합니다.
        </p>
      </header>

      <AdminReviewSearchBar
        value={keywordInput}
        onChange={setKeywordInput}
        onSubmit={handleSubmitSearch}
        inputId="admin-residence-review-search"
      />

      <AdminReviewSortChips
        value={sort}
        options={ADMIN_RESIDENCE_REVIEW_SORT_OPTIONS}
        onChange={(nextSort) => {
          setSort(nextSort);
          setPage(1);
        }}
      />

      <div className="flex flex-col gap-3">
        {listResult.items.map((review) => (
          <AdminResidenceReviewCard
            key={review.id}
            review={review}
            disabled={isPending}
            onHide={openHideReasonModal}
            onUnhide={handleUnhide}
          />
        ))}
      </div>

      {listResult.items.length === 0 ? (
        <AdminReviewEmptyState message="조건에 맞는 거주후기가 없습니다." />
      ) : null}

      <AdminReviewPagination pagination={listResult.pagination} onChangePage={setPage} />

      {reasonModal ? (
        <AdminReviewHideReasonModal
          authorName={reasonModal.review.author.name}
          reason={reasonInput}
          isPending={isPending}
          error={null}
          onReasonChange={setReasonInput}
          onClose={closeReasonModal}
          onConfirm={handleConfirmHide}
        />
      ) : null}

      {feedback ? (
        <AdminReviewFeedbackToast tone={feedback.tone} message={feedback.message} />
      ) : null}
    </section>
  );
}
