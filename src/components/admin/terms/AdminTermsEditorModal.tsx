"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import AdminTermsContent from "@/components/admin/terms/AdminTermsContent";
import { ChevronDownIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { formatKoreanDateTime } from "@/lib/utils/date";
import type {
  AdminTerms,
  AdminTermsAudience,
  AdminTermsType,
  CreateAdminTermsPayload,
  UpdateAdminTermsPayload,
} from "@/types/adminTerms";
import {
  ADMIN_TERMS_AUDIENCE_LABELS,
  ADMIN_TERMS_STATUS_LABELS,
  ADMIN_TERMS_TYPE_LABELS,
  ADMIN_TERMS_TYPE_ORDER,
  isAdminTermsEditable,
} from "@/types/adminTerms";

interface AdminTermsEditorModalProps {
  mode: "create" | "edit";
  terms: AdminTerms | null;
  isLoading: boolean;
  error: unknown;
  isPending: boolean;
  onClose: () => void;
  onCreate: (payload: CreateAdminTermsPayload) => Promise<void>;
  onUpdate: (termsId: number, payload: UpdateAdminTermsPayload) => Promise<void>;
  onPublish: (() => void) | null;
  onDelete: (() => void) | null;
  onRetry?: () => void;
}

interface TermsFormState {
  type: AdminTermsType;
  version: string;
  title: string;
  content: string;
  isRequired: boolean;
  audience: AdminTermsAudience;
  /** YYYY-MM-DD. 빈 문자열이면 미지정입니다. */
  effectiveAt: string;
}

const INITIAL_FORM_STATE: TermsFormState = {
  type: "TERMS_OF_SERVICE",
  version: "",
  title: "",
  content: "",
  isRequired: true,
  audience: "ALL",
  effectiveAt: "",
};

/**
 * 서버는 시행일을 UTC 자정 timestamp 로 저장하므로 ISO 앞 10자리가 곧 날짜입니다.
 * 로컬 타임존으로 변환하면 하루가 밀 수 있어 UTC 기준으로 자릅니다.
 */
function toDateInputValue(value: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function toFormState(terms: AdminTerms): TermsFormState {
  return {
    type: terms.type,
    version: terms.version,
    title: terms.title,
    content: terms.content,
    isRequired: terms.isRequired,
    audience: terms.audience,
    effectiveAt: toDateInputValue(terms.effectiveAt),
  };
}

export default function AdminTermsEditorModal({
  mode,
  terms,
  isLoading,
  error,
  isPending,
  onClose,
  onCreate,
  onUpdate,
  onPublish,
  onDelete,
  onRetry,
}: AdminTermsEditorModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  const [form, setForm] = useState<TermsFormState>(() =>
    mode === "edit" && terms ? toFormState(terms) : INITIAL_FORM_STATE,
  );
  const [bodyTab, setBodyTab] = useState<"write" | "preview">("write");

  const isEditMode = mode === "edit";

  /*
   * 백엔드는 DRAFT 만 수정·삭제·게시를 허용합니다(termsService).
   * PUBLISHED / ARCHIVED 는 읽기 전용으로 열어, 저장 버튼을 눌러 400 을 받는 흐름을 막습니다.
   */
  const isReadOnly = isEditMode && terms !== null && !isAdminTermsEditable(terms.status);
  const isFieldDisabled = isPending || isReadOnly;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      firstFieldRef.current?.focus();
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

  const isSaveDisabled = useMemo(() => {
    if (isFieldDisabled) {
      return true;
    }

    const hasBasics = form.title.trim().length > 0 && form.content.trim().length > 0;

    // 버전은 생성 시에만 입력하므로 수정에서는 검사하지 않습니다.
    return mode === "create" ? !hasBasics || form.version.trim().length === 0 : !hasBasics;
  }, [form.content, form.title, form.version, isFieldDisabled, mode]);

  const handleSubmit = async () => {
    if (isSaveDisabled) {
      return;
    }

    if (mode === "create") {
      await onCreate({
        type: form.type,
        version: form.version.trim(),
        title: form.title.trim(),
        content: form.content.trim(),
        isRequired: form.isRequired,
        audience: form.audience,
        // 빈 문자열을 보내면 스키마(YYYY-MM-DD)에 걸리므로 아예 생략합니다.
        ...(form.effectiveAt ? { effectiveAt: form.effectiveAt } : {}),
      });
      return;
    }

    if (!terms) {
      return;
    }

    await onUpdate(terms.id, {
      title: form.title.trim(),
      content: form.content.trim(),
      isRequired: form.isRequired,
      audience: form.audience,
      ...(form.effectiveAt ? { effectiveAt: form.effectiveAt } : {}),
    });
  };

  const showBody = !isEditMode || terms !== null || (!isLoading && !error);

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
        aria-labelledby="admin-terms-editor-title"
        className="relative flex max-h-[calc(100vh-32px)] w-full flex-col overflow-hidden rounded-t-[22px] border border-border bg-surface shadow-lg sm:max-h-[min(90vh,760px)] sm:max-w-[680px] sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <div>
            <h2 id="admin-terms-editor-title" className="text-2xl font-semibold text-foreground">
              {mode === "create" ? "약관 작성" : isReadOnly ? "약관 상세" : "약관 수정"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {mode === "create"
                ? "새 버전을 초안으로 등록합니다. 게시는 저장 후 따로 진행합니다."
                : isReadOnly
                  ? "게시되었거나 보관된 버전은 이력 보존을 위해 수정할 수 없습니다."
                  : "초안 내용을 수정합니다."}
            </p>
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

        {isEditMode && isLoading && !terms ? (
          <div className="px-5 pb-6 sm:px-6">
            <div className="rounded-2xl border border-border bg-background px-4 py-5 text-sm text-muted">
              약관 상세를 불러오는 중입니다.
            </div>
          </div>
        ) : null}

        {isEditMode && error && !terms ? (
          <div className="px-5 pb-6 sm:px-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-600">
              약관 상세를 불러오지 못했습니다.
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

        {showBody ? (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5 sm:px-6">
              {isEditMode && terms ? (
                <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted">
                  <dl className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs tracking-[0.04em] uppercase">유형 / 버전</dt>
                      <dd className="mt-1 text-foreground">
                        {ADMIN_TERMS_TYPE_LABELS[terms.type]} · v{terms.version}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-[0.04em] uppercase">상태</dt>
                      <dd className="mt-1 text-foreground">
                        {ADMIN_TERMS_STATUS_LABELS[terms.status]}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-[0.04em] uppercase">작성자</dt>
                      <dd className="mt-1 text-foreground">{terms.author?.name ?? "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-[0.04em] uppercase">게시일</dt>
                      <dd className="mt-1 text-foreground">
                        {terms.publishedAt ? formatKoreanDateTime(terms.publishedAt) : "-"}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : null}

              {isReadOnly ? (
                <p className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
                  이 버전은 읽기 전용입니다. 내용을 바꾸려면 <b className="text-foreground">새 버전을 작성</b>한 뒤
                  게시하세요. 게시하면 이 버전은 자동으로 보관 처리됩니다.
                </p>
              ) : null}

              {/* 유형·버전은 약관의 정체성이라 생성 시에만 지정합니다. */}
              {mode === "create" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm text-muted">약관 유형</span>
                    <span className="relative block">
                      <select
                        ref={firstFieldRef as React.RefObject<HTMLSelectElement>}
                        value={form.type}
                        onChange={(event) => {
                          setForm((current) => ({
                            ...current,
                            type: event.target.value as AdminTermsType,
                          }));
                        }}
                        className="h-11 w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-10 text-sm text-foreground outline-none transition focus:border-accent"
                        disabled={isFieldDisabled}
                      >
                        {ADMIN_TERMS_TYPE_ORDER.map((type) => (
                          <option key={type} value={type}>
                            {ADMIN_TERMS_TYPE_LABELS[type]}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
                    </span>
                  </label>

                  <div className="space-y-2">
                    <label htmlFor="admin-terms-version" className="text-sm text-muted">
                      버전
                    </label>
                    <input
                      id="admin-terms-version"
                      value={form.version}
                      onChange={(event) => {
                        setForm((current) => ({ ...current, version: event.target.value }));
                      }}
                      placeholder="예: 1.0 또는 2026.09.01"
                      maxLength={20}
                      className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent"
                      disabled={isFieldDisabled}
                    />
                    <p className="text-xs text-muted">
                      같은 유형에서 이미 쓴 버전은 다시 쓸 수 없습니다. 등록 후에는 변경할 수 없습니다.
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="admin-terms-title" className="text-sm text-muted">
                  제목
                </label>
                <input
                  ref={mode === "create" ? undefined : (firstFieldRef as React.RefObject<HTMLInputElement>)}
                  id="admin-terms-title"
                  value={form.title}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, title: event.target.value }));
                  }}
                  placeholder="약관 제목을 입력하세요"
                  maxLength={200}
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent"
                  disabled={isFieldDisabled}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted">본문 (Markdown)</span>
                  <div className="flex items-center gap-1 rounded-full border border-border bg-background p-0.5">
                    {(["write", "preview"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setBodyTab(tab)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs transition",
                          bodyTab === tab
                            ? "bg-surface text-foreground shadow-sm"
                            : "text-muted hover:text-foreground",
                        )}
                      >
                        {tab === "write" ? "작성" : "미리보기"}
                      </button>
                    ))}
                  </div>
                </div>

                {bodyTab === "write" ? (
                  <textarea
                    id="admin-terms-content"
                    value={form.content}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, content: event.target.value }));
                    }}
                    placeholder={"## 제1조 (목적)\n\n본 약관은 ..."}
                    className="min-h-[260px] w-full rounded-lg border border-border bg-surface px-3 py-3 font-mono text-sm leading-6 text-foreground outline-none transition focus:border-accent sm:min-h-[300px]"
                    disabled={isFieldDisabled}
                  />
                ) : (
                  <div className="min-h-[260px] overflow-y-auto rounded-lg border border-border bg-background px-4 py-4 sm:min-h-[300px]">
                    {form.content.trim() ? (
                      <AdminTermsContent content={form.content} />
                    ) : (
                      <p className="text-sm text-muted">미리볼 내용이 없습니다.</p>
                    )}
                  </div>
                )}

                <p className="text-xs text-muted">
                  사용자 화면과 동일한 스타일로 렌더링됩니다. 조 제목은 <code>##</code>, 항은 목록으로 작성하세요.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-muted">동의 대상</span>
                  <span className="relative block">
                    <select
                      value={form.audience}
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          audience: event.target.value as AdminTermsAudience,
                        }));
                      }}
                      className="h-11 w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-10 text-sm text-foreground outline-none transition focus:border-accent"
                      disabled={isFieldDisabled}
                    >
                      {(["ALL", "CUSTOMER", "MOVER"] as const).map((audience) => (
                        <option key={audience} value={audience}>
                          {ADMIN_TERMS_AUDIENCE_LABELS[audience]}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
                  </span>
                </label>

                <div className="space-y-2">
                  <label htmlFor="admin-terms-effective-at" className="text-sm text-muted">
                    시행일
                  </label>
                  <input
                    id="admin-terms-effective-at"
                    type="date"
                    value={form.effectiveAt}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, effectiveAt: event.target.value }));
                    }}
                    className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-accent"
                    disabled={isFieldDisabled}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.isRequired}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, isRequired: event.target.checked }));
                  }}
                  disabled={isFieldDisabled}
                  className="size-4 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-sm text-foreground">
                  필수 동의 항목입니다.
                  <span className="ml-1 text-muted">
                    (해제하면 마케팅 수신처럼 선택 동의가 됩니다)
                  </span>
                </span>
              </label>
            </div>

            <div className="border-t border-border px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
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
                    {isReadOnly ? "닫기" : "취소"}
                  </button>

                  {isEditMode && onPublish ? (
                    <button
                      type="button"
                      onClick={onPublish}
                      disabled={isPending}
                      className="rounded-xl border border-accent px-4 py-2 text-sm font-semibold text-accent disabled:opacity-40"
                    >
                      게시하기
                    </button>
                  ) : null}

                  {!isReadOnly ? (
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
                      {isPending
                        ? mode === "create"
                          ? "등록 중..."
                          : "저장 중..."
                        : mode === "create"
                          ? "초안 등록"
                          : "수정 저장"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
