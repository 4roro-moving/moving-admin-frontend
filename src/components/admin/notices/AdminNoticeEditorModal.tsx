"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDownIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import type {
  AdminNotice,
  CreateAdminNoticePayload,
  NoticeAudience,
  UpdateAdminNoticePayload,
} from "@/types/adminNotice";

interface AdminNoticeEditorModalProps {
  mode: "create" | "edit";
  notice: AdminNotice | null;
  isLoading: boolean;
  error: unknown;
  isPending: boolean;
  onClose: () => void;
  onCreate: (payload: CreateAdminNoticePayload) => Promise<void>;
  onUpdate: (noticeId: number, payload: UpdateAdminNoticePayload) => Promise<void>;
  onDelete: (() => void) | null;
  onRetry?: () => void;
}

interface NoticeFormState {
  title: string;
  content: string;
  audience: NoticeAudience;
  isPinned: boolean;
  isVisible: boolean;
  sendNotification: boolean;
}

const INITIAL_FORM_STATE: NoticeFormState = {
  title: "",
  content: "",
  audience: "ALL",
  isPinned: false,
  isVisible: true,
  sendNotification: false,
};

function toFormState(notice: AdminNotice): NoticeFormState {
  return {
    title: notice.title,
    content: notice.content,
    audience: notice.audience,
    isPinned: notice.isPinned,
    isVisible: notice.isVisible,
    sendNotification: false,
  };
}

function formatNoticeDateTime(value: string) {
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
  return mode === "create" ? "공지사항 작성" : "공지사항 수정";
}

function getModalDescription(mode: "create" | "edit") {
  return mode === "create"
    ? "새 항목을 등록합니다."
    : "등록된 공지사항을 수정합니다.";
}

export default function AdminNoticeEditorModal({
  mode,
  notice,
  isLoading,
  error,
  isPending,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onRetry,
}: AdminNoticeEditorModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<NoticeFormState>(() => {
    if (mode === "edit" && notice) {
      return toFormState(notice);
    }

    return INITIAL_FORM_STATE;
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      titleInputRef.current?.focus();
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
  const isSaveDisabled = useMemo(
    () => form.title.trim().length === 0 || form.content.trim().length === 0 || isPending,
    [form.content, form.title, isPending],
  );

  const handleSubmit = async () => {
    if (form.title.trim().length === 0 || form.content.trim().length === 0) {
      return;
    }

    if (mode === "create") {
      await onCreate({
        title: form.title.trim(),
        content: form.content.trim(),
        audience: form.audience,
        isPinned: form.isPinned,
        isVisible: form.isVisible,
        sendNotification: form.sendNotification,
      });
      return;
    }

    if (!notice) {
      return;
    }

    await onUpdate(notice.id, {
      title: form.title.trim(),
      content: form.content.trim(),
      audience: form.audience,
      isPinned: form.isPinned,
      isVisible: form.isVisible,
    });
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
        aria-labelledby="admin-notice-editor-title"
        className="relative flex max-h-[calc(100vh-32px)] w-full flex-col overflow-hidden rounded-t-[22px] border border-border bg-surface shadow-lg sm:max-h-[min(90vh,720px)] sm:max-w-[560px] sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <div>
            <h2
              id="admin-notice-editor-title"
              className="text-2xl font-semibold text-foreground"
            >
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

        {isEditMode && isLoading && !notice ? (
          <div className="px-5 pb-6 sm:px-6">
            <div className="rounded-2xl border border-border bg-background px-4 py-5 text-sm text-muted">
              공지사항 상세를 불러오는 중입니다.
            </div>
          </div>
        ) : null}

        {isEditMode && error && !notice ? (
          <div className="px-5 pb-6 sm:px-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-600">
              공지사항 상세를 불러오지 못했습니다.
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

        {(!isEditMode || notice || (!isLoading && !error)) ? (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5 sm:px-6">
              {isEditMode && notice ? (
                <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted">
                  <dl className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.04em]">작성자</dt>
                      <dd className="mt-1 text-foreground">{notice.authorId}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.04em]">노출 대상</dt>
                      <dd className="mt-1 text-foreground">{form.audience}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.04em]">작성일</dt>
                      <dd className="mt-1 text-foreground">{formatNoticeDateTime(notice.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.04em]">수정일</dt>
                      <dd className="mt-1 text-foreground">{formatNoticeDateTime(notice.updatedAt)}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="admin-notice-title" className="text-sm text-muted">
                  제목
                </label>
                <input
                  ref={titleInputRef}
                  id="admin-notice-title"
                  value={form.title}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, title: event.target.value }));
                  }}
                  placeholder="공지 제목을 입력하세요"
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-notice-content" className="text-sm text-muted">
                  내용
                </label>
                <textarea
                  id="admin-notice-content"
                  value={form.content}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, content: event.target.value }));
                  }}
                  placeholder="공지 내용을 입력하세요"
                  className="min-h-[220px] w-full rounded-lg border border-border bg-surface px-3 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-accent sm:min-h-[250px]"
                  disabled={isPending}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-muted">노출 대상</span>
                  <span className="relative block">
                    <select
                      value={form.audience}
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          audience: event.target.value as NoticeAudience,
                        }));
                      }}
                      className="h-11 w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-10 text-sm text-foreground outline-none transition focus:border-accent"
                      disabled={isPending}
                    >
                      <option value="ALL">전체</option>
                      <option value="CUSTOMER">고객</option>
                      <option value="MOVER">기사</option>
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
                  </span>
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-muted">게시 상태</span>
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
                      <option value="VISIBLE">게시중</option>
                      <option value="HIDDEN">숨김</option>
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
                  </span>
                </label>
              </div>

              <div className="grid gap-3">
                <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        isPinned: event.target.checked,
                      }));
                    }}
                    disabled={isPending}
                    className="size-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-foreground">상단 고정으로 노출합니다.</span>
                </label>

                {mode === "create" ? (
                  <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.sendNotification}
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          sendNotification: event.target.checked,
                        }));
                      }}
                      disabled={isPending}
                      className="size-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-foreground">
                      등록 후 사용자에게 알림을 함께 발송합니다.
                    </span>
                  </label>
                ) : null}
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
