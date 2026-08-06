"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useHideAdminReview } from "@/hooks/useHideAdminReview";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { useUnhideAdminReview } from "@/hooks/useUnhideAdminReview";
import { ADMIN_REVIEW_LIST_PAGE_LIMIT } from "@/lib/api/adminReviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";
import type { AdminReviewItem, AdminReviewSort } from "@/types/adminReview";

const SORT_OPTIONS: Array<{ value: AdminReviewSort; label: string }> = [
  { value: "LATEST", label: "최신순" },
  { value: "OLDEST", label: "오래된순" },
  { value: "RATING_HIGH", label: "별점 높은순" },
  { value: "RATING_LOW", label: "별점 낮은순" },
  { value: "REPORT_HIGH", label: "신고 많은순" },
];

const HIDE_REASON_MIN_LENGTH = 10;
const HIDE_REASON_MAX_LENGTH = 500;

function getHideReasonCharCount(reason: string): number {
  return reason.replace(/\s/g, "").length;
}

function isValidHideReason(reason: string): boolean {
  const count = getHideReasonCharCount(reason);
  return count >= HIDE_REASON_MIN_LENGTH && count <= HIDE_REASON_MAX_LENGTH;
}

interface HideReasonModalState {
  review: AdminReviewItem;
}

interface UnhideErrorState {
  reviewId: number;
  message: string;
}

function formatReviewDate(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  });

  return formatter.format(date).replace(/\./g, ".").replace(/\s/g, "");
}

function renderStars(rating: number): string {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`;
}

function getVisiblePages(currentPage: number, pageCount: number): number[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, pageCount, currentPage]);
  for (let offset = -1; offset <= 1; offset += 1) {
    const page = currentPage + offset;
    if (page > 1 && page < pageCount) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export default function AdminContentsReviewsPage() {
  const [page, setPage] = useState(1);
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<AdminReviewSort>("LATEST");
  const [reasonModal, setReasonModal] = useState<HideReasonModalState | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [unhideError, setUnhideError] = useState<UnhideErrorState | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const reasonTextareaRef = useRef<HTMLTextAreaElement>(null);
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
  const hideMutation = useHideAdminReview();
  const unhideMutation = useUnhideAdminReview();

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const visiblePages = getVisiblePages(pagination?.page ?? page, totalPages);
  const reasonCharCount = getHideReasonCharCount(reasonInput);

  const handleSubmitSearch = () => {
    setKeyword(keywordInput.trim());
    setPage(1);
  };

  const isActionPending = hideMutation.isPending || unhideMutation.isPending;

  const openHideReasonModal = (review: AdminReviewItem) => {
    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setReasonModal({ review });
    setReasonInput("");
  };

  const closeReasonModal = () => {
    if (hideMutation.isPending) {
      return;
    }
    setReasonModal(null);
    setReasonInput("");
    previouslyFocusedElementRef.current?.focus();
    previouslyFocusedElementRef.current = null;
  };

  const handleConfirmHide = async () => {
    if (!reasonModal) return;

    const trimmedReason = reasonInput.trim();
    if (!isValidHideReason(trimmedReason)) {
      return;
    }

    await hideMutation.mutateAsync({ reviewId: reasonModal.review.id, reason: trimmedReason });
    setReasonModal(null);
    setReasonInput("");
    previouslyFocusedElementRef.current?.focus();
    previouslyFocusedElementRef.current = null;
  };

  const handleUnhide = async (review: AdminReviewItem) => {
    if (isActionPending) {
      return;
    }

    setUnhideError(null);

    try {
      await unhideMutation.mutateAsync({ reviewId: review.id });
    } catch (unhideException) {
      setUnhideError({
        reviewId: review.id,
        message: getApiErrorMessage(unhideException, "복구 처리에 실패했습니다."),
      });
    }
  };

  useEffect(() => {
    if (!reasonModal) {
      return;
    }

    const dialog = dialogRef.current;
    reasonTextareaRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!hideMutation.isPending) {
          setReasonModal(null);
          setReasonInput("");
          previouslyFocusedElementRef.current?.focus();
          previouslyFocusedElementRef.current = null;
        }
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hideMutation.isPending, reasonModal]);

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">리뷰 관리</h1>
        <p className="text-muted text-sm">
          작성자·키워드 검색, 정렬, 숨김/복구 및 처리 사유 기록을 관리합니다.
        </p>
      </header>

      <form
        className="w-full max-w-md"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmitSearch();
        }}
      >
        <label htmlFor="admin-review-search" className="sr-only">
          작성자 또는 키워드 검색
        </label>
        <input
          id="admin-review-search"
          type="search"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
          placeholder="작성자 또는 키워드 검색"
          className="border-border bg-surface text-foreground placeholder:text-muted focus:border-accent w-full rounded-xl border px-4 py-3 text-sm outline-none"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2">
        {SORT_OPTIONS.map((option) => {
          const isActive = sort === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSort(option.value);
                setPage(1);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                isActive
                  ? "border-accent bg-accent-muted text-accent font-semibold"
                  : "border-border bg-surface text-muted font-medium",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="border-border bg-surface rounded-2xl border px-5 py-6">
          <p className="text-muted text-sm">리뷰 목록을 불러오는 중입니다.</p>
        </div>
      ) : null}

      {isError ? (
        <div className="border-border bg-surface rounded-2xl border px-5 py-4">
          <p className="text-sm text-red-600">
            {getApiErrorMessage(error, "리뷰 목록을 불러오지 못했습니다.")}
          </p>
          <button
            type="button"
            className="border-border mt-3 rounded-lg border px-3 py-2 text-sm"
            onClick={() => {
              void refetch();
            }}
          >
            다시 시도
          </button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <>
          <div className="flex flex-col gap-3">
            {items.map((review) => {
              const isHidden = review.isHidden;
              const actionLabel = isHidden ? "복구" : "숨김";

              return (
                <article
                  key={review.id}
                  className="border-border bg-surface rounded-2xl border px-6 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-foreground">{review.author.name}</p>
                        <p className="text-muted text-sm">{formatReviewDate(review.createdAt)}</p>
                        <p className="text-sm text-amber-500">{renderStars(review.rating)}</p>

                        {review.reportCount > 0 ? (
                          <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                            신고 {review.reportCount}
                          </span>
                        ) : null}

                        {isHidden ? (
                          <span className="bg-accent-muted text-accent rounded-md px-2 py-0.5 text-xs font-semibold">
                            숨김
                          </span>
                        ) : null}
                      </div>

                      <p className="text-muted text-xs">
                        기사님 {review.mover.name} · 견적 #{review.estimateId}
                      </p>

                      <p className={cn("text-sm leading-relaxed", isHidden ? "text-muted" : "text-foreground/80")}>
                        {review.content}
                      </p>

                      {review.latestModeration?.reason ? (
                        <div className="bg-background mt-1 rounded-lg px-3 py-2">
                          <p className="text-muted text-xs font-semibold">
                            {review.latestModeration.action === "HIDE"
                              ? "관리자 숨김 사유"
                              : "관리자 복구 사유"}
                          </p>
                          <p className="mt-1 text-sm text-foreground/80">
                            {review.latestModeration.reason}
                          </p>
                        </div>
                      ) : null}

                      {unhideError?.reviewId === review.id ? (
                        <p role="alert" className="mt-1 text-xs text-red-600">
                          {unhideError.message}
                        </p>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className={cn(
                        "shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40",
                        isHidden
                          ? "border-transparent bg-accent text-white"
                          : "border-red-200 bg-surface text-red-600",
                      )}
                      disabled={isActionPending}
                      onClick={() => {
                        if (isHidden) {
                          void handleUnhide(review);
                          return;
                        }
                        openHideReasonModal(review);
                      }}
                    >
                      {actionLabel}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {items.length === 0 ? (
            <div className="border-border bg-surface rounded-2xl border px-5 py-10 text-center">
              <p className="text-muted text-sm">조건에 맞는 리뷰가 없습니다.</p>
            </div>
          ) : null}

          {pagination ? (
            <nav aria-label="리뷰 목록 페이지" className="flex items-center justify-center gap-1 pt-2">
              <button
                type="button"
                className="border-border text-muted rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                disabled={pagination.page <= 1}
                onClick={() => {
                  setPage(pagination.page - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                이전
              </button>
              {visiblePages.map((pageNumber, index) => {
                const previous = visiblePages[index - 1];
                const showEllipsis = previous !== undefined && pageNumber - previous > 1;

                return (
                  <span key={pageNumber} className="flex items-center gap-1">
                    {showEllipsis ? <span className="text-muted px-1 text-sm">…</span> : null}
                    <button
                      type="button"
                      aria-current={pageNumber === pagination.page ? "page" : undefined}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm",
                        pageNumber === pagination.page
                          ? "border-accent bg-accent text-white"
                          : "border-border text-muted bg-surface",
                      )}
                      onClick={() => {
                        setPage(pageNumber);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {pageNumber}
                    </button>
                  </span>
                );
              })}
              <button
                type="button"
                className="border-border text-muted rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                disabled={pagination.page >= totalPages}
                onClick={() => {
                  setPage(pagination.page + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                다음
              </button>
            </nav>
          ) : null}
        </>
      ) : null}

      {reasonModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="presentation"
          onClick={closeReasonModal}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-review-reason-title"
            className="bg-surface w-full max-w-lg rounded-2xl p-6 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="admin-review-reason-title" className="text-xl font-semibold text-foreground">
              숨김 사유 입력
            </h2>
            <p className="text-muted mt-3 text-sm">
              콘텐츠를 숨김 처리합니다. 사유는 공백 제외 최소 {HIDE_REASON_MIN_LENGTH}자 이상
              입력해야 하며, 작성자 알림으로 전달됩니다.
            </p>
            <div className="mt-4">
              <label htmlFor="admin-review-reason" className="text-sm font-semibold text-foreground">
                처리 사유 (최소 {HIDE_REASON_MIN_LENGTH}자)
              </label>
              <textarea
                ref={reasonTextareaRef}
                id="admin-review-reason"
                value={reasonInput}
                onChange={(event) => setReasonInput(event.target.value)}
                placeholder="예: 신고 누적 / 커뮤니티 가이드라인 위반"
                maxLength={HIDE_REASON_MAX_LENGTH}
                className="border-border bg-surface text-foreground placeholder:text-muted mt-2 h-36 w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:border-brand"
                disabled={hideMutation.isPending}
              />
              <p className="text-muted mt-2 text-xs">
                공백 제외 {reasonCharCount}/{HIDE_REASON_MAX_LENGTH}자 (최소{" "}
                {HIDE_REASON_MIN_LENGTH}자)
              </p>
            </div>
            {hideMutation.isError ? (
              <p className="mt-2 text-xs text-red-600">
                {getApiErrorMessage(hideMutation.error, "요청 처리에 실패했습니다.")}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="border-border rounded-lg border px-4 py-2 text-sm"
                onClick={closeReasonModal}
                disabled={hideMutation.isPending}
              >
                취소
              </button>
              <button
                type="button"
                className="bg-accent rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                disabled={hideMutation.isPending || !isValidHideReason(reasonInput)}
                onClick={() => {
                  void handleConfirmHide();
                }}
              >
                {hideMutation.isPending ? "숨김 처리 중..." : "숨김 처리"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isFetching && !isLoading ? (
        <div className="border-border bg-surface text-muted fixed right-5 bottom-5 rounded-lg border px-3 py-2 text-xs shadow">
          목록을 갱신 중입니다.
        </div>
      ) : null}
    </section>
  );
}
