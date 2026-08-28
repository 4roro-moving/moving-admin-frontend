"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils/cn";

interface AdminReportActionModalProps {
  action: "RESOLVED" | "REJECTED";
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminReportActionModal({
  action,
  isPending,
  onClose,
  onConfirm,
}: AdminReportActionModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const actionLabel = action === "RESOLVED" ? "처리 완료" : "반려";

  useEffect(() => {
    confirmButtonRef.current?.focus();
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
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

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
        aria-labelledby="admin-report-action-modal-title"
        className="bg-surface w-full max-w-md rounded-2xl p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="admin-report-action-modal-title" className="text-xl font-semibold text-foreground">
          {actionLabel} 확인
        </h2>
        <p className="text-muted mt-3 text-sm">
          선택한 신고를 {actionLabel} 상태로 변경합니다. 현재 입력한 처리 메모가 함께 저장됩니다.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="border-border rounded-xl border px-4 py-2 text-sm"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-40",
              action === "RESOLVED" ? "bg-accent" : "bg-red-500",
            )}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "처리 중..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
