"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDownIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import type {
  AdminFaq,
  CreateAdminFaqPayload,
  UpdateAdminFaqPayload,
} from "@/types/adminFaq";

interface AdminFaqEditorModalProps {
  mode: "create" | "edit";
  faq: AdminFaq | null;
  isLoading: boolean;
  error: unknown;
  isPending: boolean;
  onClose: () => void;
  onCreate: (payload: CreateAdminFaqPayload) => Promise<void>;
  onUpdate: (faqId: number, payload: UpdateAdminFaqPayload) => Promise<void>;
  onDelete: (() => void) | null;
  onRetry?: () => void;
}

interface FaqFormState {
  question: string;
  answer: string;
  sortOrder: string;
  isVisible: boolean;
}

const INITIAL_FORM_STATE: FaqFormState = {
  question: "",
  answer: "",
  sortOrder: "0",
  isVisible: true,
};

function toFormState(faq: AdminFaq): FaqFormState {
  return {
    question: faq.question,
    answer: faq.answer,
    sortOrder: String(faq.sortOrder),
    isVisible: faq.isVisible,
  };
}

function formatFaqDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

function getModalTitle(mode: "create" | "edit") {
  return mode === "create" ? "FAQ 작성" : "FAQ 수정";
}

function getModalDescription(mode: "create" | "edit") {
  return mode === "create" ? "새 항목을 등록합니다." : "등록된 FAQ를 수정합니다.";
}

export default function AdminFaqEditorModal({
  mode,
  faq,
  isLoading,
  error,
  isPending,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onRetry,
}: AdminFaqEditorModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FaqFormState>(() => {
    if (mode === "edit" && faq) {
      return toFormState(faq);
    }

    return INITIAL_FORM_STATE;
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      questionInputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
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

  const isEditMode = mode === "edit";
  const parsedSortOrder = Number(form.sortOrder);
  const isSaveDisabled = useMemo(
    () =>
      form.question.trim().length === 0 ||
      form.answer.trim().length === 0 ||
      form.sortOrder.trim().length === 0 ||
      !Number.isInteger(parsedSortOrder) ||
      parsedSortOrder < 0 ||
      isPending,
    [form.answer, form.question, form.sortOrder, isPending, parsedSortOrder],
  );

  const handleSubmit = async () => {
    if (isSaveDisabled) {
      return;
    }

    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      sortOrder: parsedSortOrder,
      isVisible: form.isVisible,
    };

    if (mode === "create") {
      await onCreate(payload);
      return;
    }

    if (!faq) {
      return;
    }

    await onUpdate(faq.id, payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 sm:items-center sm:px-4"
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
        aria-labelledby="admin-faq-editor-title"
        className="relative flex max-h-[calc(100vh-32px)] w-full flex-col overflow-hidden rounded-t-[22px] border border-border bg-surface shadow-lg sm:max-h-[min(90vh,760px)] sm:max-w-[560px] sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <div>
            <h2 id="admin-faq-editor-title" className="text-2xl font-semibold text-foreground">
              {getModalTitle(mode)}
            </h2>
            <p className="mt-1 text-sm text-muted">{getModalDescription(mode)}</p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-muted transition hover:bg-background hover:text-foreground disabled:opacity-40"
            onClick={onClose}
            disabled={isPending}
            aria-label="모달 닫기"
          >
            <span aria-hidden className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        {isEditMode && isLoading && !faq ? (
          <div className="px-5 pb-6 sm:px-6">
            <div className="rounded-2xl border border-border bg-background px-4 py-5 text-sm text-muted">
              FAQ 상세를 불러오는 중입니다.
            </div>
          </div>
        ) : null}

        {isEditMode && error && !faq ? (
          <div className="px-5 pb-6 sm:px-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-600">
              FAQ 상세를 불러오지 못했습니다.
              {onRetry ? (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-lg border border-red-200 bg-surface px-3 py-2 text-sm text-red-600"
                  >
                    다시 시도
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {(!isEditMode || faq || (!isLoading && !error)) ? (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5 sm:px-6">
              {isEditMode && faq ? (
                <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted">
                  <dl className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.04em]">작성자</dt>
                      <dd className="mt-1 text-foreground">{faq.authorId}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.04em]">정렬 순서</dt>
                      <dd className="mt-1 text-foreground">{faq.sortOrder}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.04em]">작성일</dt>
                      <dd className="mt-1 text-foreground">{formatFaqDateTime(faq.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.04em]">수정일</dt>
                      <dd className="mt-1 text-foreground">{formatFaqDateTime(faq.updatedAt)}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="admin-faq-question" className="text-sm text-muted">
                  질문
                </label>
                <input
                  ref={questionInputRef}
                  id="admin-faq-question"
                  value={form.question}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, question: event.target.value }));
                  }}
                  placeholder="FAQ 질문을 입력하세요"
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-faq-answer" className="text-sm text-muted">
                  답변
                </label>
                <textarea
                  id="admin-faq-answer"
                  value={form.answer}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, answer: event.target.value }));
                  }}
                  placeholder="FAQ 답변을 입력하세요"
                  className="min-h-[220px] w-full rounded-lg border border-border bg-surface px-3 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-accent sm:min-h-[250px]"
                  disabled={isPending}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-muted">정렬 순서</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.sortOrder}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, sortOrder: event.target.value }));
                    }}
                    className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent"
                    disabled={isPending}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-muted">노출 상태</span>
                  <span className="relative block">
                    <select
                      value={form.isVisible ? "VISIBLE" : "HIDDEN"}
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          isVisible: event.target.value === "VISIBLE",
                        }));
                      }}
                      className="h-11 w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-10 text-sm text-foreground outline-none transition focus:border-accent"
                      disabled={isPending}
                    >
                      <option value="VISIBLE">노출</option>
                      <option value="HIDDEN">숨김</option>
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
                  </span>
                </label>
              </div>
            </div>

            <div className="border-t border-border px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  {isEditMode && onDelete ? (
                    <button
                      type="button"
                      onClick={onDelete}
                      disabled={isPending}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 disabled:opacity-40"
                    >
                      삭제
                    </button>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground disabled:opacity-40"
                    onClick={onClose}
                    disabled={isPending}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40",
                      isSaveDisabled && "opacity-40",
                    )}
                    onClick={() => {
                      void handleSubmit();
                    }}
                    disabled={isSaveDisabled}
                  >
                    {isPending ? (mode === "create" ? "등록 중..." : "저장 중...") : mode === "create" ? "등록" : "수정 저장"}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
