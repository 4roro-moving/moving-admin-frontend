"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils/cn";

interface AdminTermsConfirmModalProps {
  title: string;
  description: ReactNode;
  confirmLabel: string;
  pendingLabel: string;
  /** danger = 삭제처럼 되돌릴 수 없는 파괴적 동작. */
  tone?: "danger" | "accent";
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * 게시·삭제 확인 모달.
 *
 * 공지/FAQ 는 삭제 전용 모달을 따로 두지만, 약관은 게시와 삭제 두 가지 확인이 필요합니다.
 * 두 벌을 복사하면 포커스 트랩 로직이 갈라지므로 문구만 주입받는 형태로 합쳤습니다.
 */
export default function AdminTermsConfirmModal({
  title,
  description,
  confirmLabel,
  pendingLabel,
  tone = "danger",
  isPending,
  onClose,
  onConfirm,
}: AdminTermsConfirmModalProps) {
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
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
        aria-labelledby="admin-terms-confirm-title"
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="admin-terms-confirm-title" className="text-xl font-semibold text-foreground">
          {title}
        </h2>
        <div className="mt-3 text-sm leading-6 text-muted">{description}</div>

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
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-40",
              tone === "danger" ? "bg-red-500" : "bg-accent",
            )}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
