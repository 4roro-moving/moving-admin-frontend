"use client";

import { useEffect, useRef } from "react";

import {
  HIDE_REASON_MAX_LENGTH,
  HIDE_REASON_MIN_LENGTH,
} from "@/lib/constants/adminReviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getHideReasonCharCount, isValidHideReason } from "@/lib/utils/adminReview";
import type { AdminReviewItem } from "@/types/adminReview";

interface AdminReviewHideReasonModalProps {
  review: AdminReviewItem;
  reason: string;
  isPending: boolean;
  error: unknown;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminReviewHideReasonModal({
  review,
  reason,
  isPending,
  error,
  onReasonChange,
  onClose,
  onConfirm,
}: AdminReviewHideReasonModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const reasonTextareaRef = useRef<HTMLTextAreaElement>(null);
  const reasonCharCount = getHideReasonCharCount(reason);

  useEffect(() => {
    reasonTextareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!isPending) {
          onClose();
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
  }, [isPending, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onClick={() => {
        if (!isPending) {
          onClose();
        }
      }}
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
        <p className="text-muted mt-2 text-sm">작성자 {review.author.name}</p>
        <p className="text-muted mt-3 text-sm">
          콘텐츠를 숨김 처리합니다. 사유는 공백 제외 최소 {HIDE_REASON_MIN_LENGTH}자 이상 입력해야
          하며, 작성자 알림으로 전달됩니다.
        </p>
        <div className="mt-4">
          <label htmlFor="admin-review-reason" className="text-sm font-semibold text-foreground">
            처리 사유 (최소 {HIDE_REASON_MIN_LENGTH}자)
          </label>
          <textarea
            ref={reasonTextareaRef}
            id="admin-review-reason"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder="예: 신고 누적 / 커뮤니티 가이드라인 위반"
            maxLength={HIDE_REASON_MAX_LENGTH}
            className="border-border bg-surface text-foreground placeholder:text-muted mt-2 h-36 w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:border-brand"
            disabled={isPending}
          />
          <p className="text-muted mt-2 text-xs">
            공백 제외 {reasonCharCount}/{HIDE_REASON_MAX_LENGTH}자 (최소 {HIDE_REASON_MIN_LENGTH}자)
          </p>
        </div>
        {error ? (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {getApiErrorMessage(error, "요청 처리에 실패했습니다.")}
          </p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="border-border rounded-lg border px-4 py-2 text-sm"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </button>
          <button
            type="button"
            className="bg-accent rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            disabled={isPending || !isValidHideReason(reason)}
            onClick={onConfirm}
          >
            {isPending ? "숨김 처리 중..." : "숨김 처리"}
          </button>
        </div>
      </div>
    </div>
  );
}
