"use client";

import { useEffect, useRef } from "react";

import type { AdminNotice } from "@/types/adminNotice";

interface AdminNoticeDeleteModalProps {
  notice: AdminNotice;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminNoticeDeleteModal({
  notice,
  isPending,
  onClose,
  onConfirm,
}: AdminNoticeDeleteModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

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
        aria-labelledby="admin-notice-delete-modal-title"
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="admin-notice-delete-modal-title"
          className="text-xl font-semibold text-foreground"
        >
          공지사항 삭제
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          <span className="font-medium text-foreground">{notice.title}</span>
          를 삭제합니다. 삭제 후에는 목록에서 다시 불러올 수 없습니다.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border border-border px-4 py-2 text-sm text-foreground disabled:opacity-40"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}
