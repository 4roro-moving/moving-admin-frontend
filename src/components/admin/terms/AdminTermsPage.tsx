"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import Search from "@/components/admin/common/Search";
import {
  AdminReviewEmptyState,
  AdminReviewErrorState,
  AdminReviewFeedbackToast,
  AdminReviewLoadingState,
} from "@/components/admin/contents/AdminReviewListStates";
import AdminReviewPagination from "@/components/admin/contents/AdminReviewPagination";
import { FilterOption, TableFilter } from "@/components/admin/users/TableFilter";
import { useAdminTermsDetail } from "@/hooks/useAdminTermsDetail";
import { useAdminTermsList } from "@/hooks/useAdminTermsList";
import {
  useCreateAdminTerms,
  useDeleteAdminTerms,
  usePublishAdminTerms,
  useUpdateAdminTerms,
} from "@/hooks/useAdminTermsMutations";
import { ADMIN_TERMS_LIST_PAGE_LIMIT } from "@/lib/api/adminTerms";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  buildUpdatedSearchParams,
  parseKeywordSearchParam,
  parsePositivePageParam,
} from "@/lib/utils/adminListSearchParams";
import { cn } from "@/lib/utils/cn";
import type {
  AdminTermsStatus,
  AdminTermsType,
  CreateAdminTermsPayload,
  UpdateAdminTermsPayload,
} from "@/types/adminTerms";
import {
  ADMIN_TERMS_STATUS_LABELS,
  ADMIN_TERMS_TYPE_LABELS,
  ADMIN_TERMS_TYPE_ORDER,
  isAdminTermsEditable,
} from "@/types/adminTerms";

import AdminTermsConfirmModal from "./AdminTermsConfirmModal";
import AdminTermsEditorModal from "./AdminTermsEditorModal";
import AdminTermsTable from "./AdminTermsTable";

type StatusFilter = AdminTermsStatus | "ALL";
type TypeFilter = AdminTermsType | "ALL";

interface TermsFeedback {
  tone: "error" | "success";
  message: string;
}

const STATUS_FILTERS: StatusFilter[] = ["ALL", "DRAFT", "PUBLISHED", "ARCHIVED"];

function isTermsStatus(value: string | null): value is AdminTermsStatus {
  return value === "DRAFT" || value === "PUBLISHED" || value === "ARCHIVED";
}

function isTermsType(value: string | null): value is AdminTermsType {
  return ADMIN_TERMS_TYPE_ORDER.includes(value as AdminTermsType);
}

function TermsFilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition",
        active
          ? "border-accent/20 bg-accent-muted text-accent"
          : "border-border bg-surface text-muted hover:bg-background",
      )}
    >
      {label}
    </button>
  );
}

export default function AdminTermsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parsePositivePageParam(searchParams.get("page"));
  const keyword = parseKeywordSearchParam(searchParams.get("keyword"));

  const statusParam = searchParams.get("status");
  const typeParam = searchParams.get("type");
  const status: StatusFilter = isTermsStatus(statusParam) ? statusParam : "ALL";
  const type: TypeFilter = isTermsType(typeParam) ? typeParam : "ALL";

  const listStateKey = JSON.stringify({ page, keyword, status, type });

  const [keywordDraft, setKeywordDraft] = useState({ key: "", value: "" });
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit" | null>(null);
  const [editingTermsId, setEditingTermsId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<"publish" | "delete" | null>(null);
  const [feedback, setFeedback] = useState<TermsFeedback | null>(null);

  const keywordInput = keywordDraft.key === listStateKey ? keywordDraft.value : keyword;

  const listQuery = useMemo(
    () => ({
      page,
      limit: ADMIN_TERMS_LIST_PAGE_LIMIT,
      keyword: keyword || undefined,
      status: status === "ALL" ? undefined : status,
      type: type === "ALL" ? undefined : type,
    }),
    [keyword, page, status, type],
  );

  const termsQuery = useAdminTermsList(listQuery);
  const detailQuery = useAdminTermsDetail(editorMode === "edit" ? editingTermsId : null);

  const createMutation = useCreateAdminTerms();
  const updateMutation = useUpdateAdminTerms();
  const publishMutation = usePublishAdminTerms();
  const deleteMutation = useDeleteAdminTerms();

  const items = termsQuery.data?.items ?? [];
  const pagination = termsQuery.data?.pagination;
  const detail = detailQuery.data ?? null;

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    publishMutation.isPending ||
    deleteMutation.isPending;

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

  const closeEditor = () => {
    setEditorMode(null);
    setEditingTermsId(null);
  };

  const navigateWithParams = (updates: Record<string, string | null | undefined>) => {
    const nextParams = buildUpdatedSearchParams(searchParams, updates);
    const nextUrl = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;

    router.push(nextUrl, { scroll: false });
  };

  const handleCreate = async (payload: CreateAdminTermsPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      closeEditor();
      setFeedback({ tone: "success", message: "약관 초안을 등록했습니다." });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "약관 등록에 실패했습니다."),
      });
    }
  };

  const handleUpdate = async (termsId: number, payload: UpdateAdminTermsPayload) => {
    try {
      await updateMutation.mutateAsync({ termsId, payload });
      closeEditor();
      setFeedback({ tone: "success", message: "약관을 수정했습니다." });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "약관 수정에 실패했습니다."),
      });
    }
  };

  const handlePublish = async () => {
    if (!detail) {
      return;
    }

    try {
      await publishMutation.mutateAsync(detail.id);
      setConfirmAction(null);
      closeEditor();
      setFeedback({
        tone: "success",
        message: `${ADMIN_TERMS_TYPE_LABELS[detail.type]} v${detail.version} 를 게시했습니다.`,
      });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "약관 게시에 실패했습니다."),
      });
    }
  };

  const handleDelete = async () => {
    if (!detail) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(detail.id);
      setConfirmAction(null);
      closeEditor();
      setFeedback({ tone: "success", message: "약관 초안을 삭제했습니다." });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "약관 삭제에 실패했습니다."),
      });
    }
  };

  return (
    <section className="flex flex-col gap-5 pb-24 md:pb-0">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-foreground">약관 관리</h1>
          <p className="text-sm text-muted">
            서비스 약관과 정책을 버전별로 작성하고 게시 상태를 관리합니다. 초안만 수정·삭제할 수 있고,
            게시하면 같은 유형의 이전 버전은 자동으로 보관됩니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditorMode("create");
            setEditingTermsId(null);
          }}
          className="hidden shrink-0 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold whitespace-nowrap text-white transition hover:brightness-95 md:inline-flex"
        >
          + 약관 작성
        </button>
      </header>

      <div className="rounded-20 border border-border bg-surface px-5 py-5 shadow-select">
        <div className="flex flex-col gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2 md:flex-nowrap md:gap-1.5 lg:gap-2">
            {STATUS_FILTERS.map((value) => (
              <TermsFilterChip
                key={value}
                label={value === "ALL" ? "전체" : ADMIN_TERMS_STATUS_LABELS[value]}
                active={status === value}
                onClick={() => {
                  navigateWithParams({
                    page: null,
                    status: value === "ALL" ? null : value,
                  });
                }}
              />
            ))}

            <TableFilter
              label={`유형: ${type === "ALL" ? "전체" : ADMIN_TERMS_TYPE_LABELS[type]}`}
              isOpen={isTypeFilterOpen}
              onToggle={() => {
                setIsTypeFilterOpen((current) => !current);
              }}
              align="start"
              isActive={type !== "ALL"}
              triggerClassName="h-[34px] rounded-full border border-border bg-surface px-3 text-muted"
            >
              {(["ALL", ...ADMIN_TERMS_TYPE_ORDER] as TypeFilter[]).map((value) => (
                <FilterOption
                  key={value}
                  selected={type === value}
                  onClick={() => {
                    navigateWithParams({
                      page: null,
                      type: value === "ALL" ? null : value,
                    });
                    setIsTypeFilterOpen(false);
                  }}
                >
                  {value === "ALL" ? "전체" : ADMIN_TERMS_TYPE_LABELS[value]}
                </FilterOption>
              ))}
            </TableFilter>
          </div>

          <div className="w-full">
            <Search
              size="responsive"
              value={keywordInput}
              placeholder="제목 또는 본문을 검색해 주세요."
              onChange={(nextKeyword) => {
                setKeywordDraft({ key: listStateKey, value: nextKeyword });
              }}
              onClear={() => {
                setKeywordDraft({ key: listStateKey, value: "" });
                navigateWithParams({ page: null, keyword: null });
              }}
              onSubmit={() => {
                navigateWithParams({
                  page: null,
                  keyword: keywordInput.trim() || null,
                });
              }}
              className="w-full md:max-w-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-20 border border-border bg-surface shadow-select">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">약관 목록</h2>
            <p className="mt-1 text-sm text-muted">총 {pagination?.totalCount ?? 0}건</p>
          </div>
        </div>

        <div className="px-5 py-5">
          {termsQuery.isLoading ? (
            <AdminReviewLoadingState message="약관 목록을 불러오는 중입니다." />
          ) : termsQuery.isError ? (
            <AdminReviewErrorState
              error={termsQuery.error}
              message="약관 목록을 불러오지 못했습니다."
              onRetry={() => {
                void termsQuery.refetch();
              }}
            />
          ) : items.length > 0 ? (
            <AdminTermsTable
              items={items}
              onSelectTerms={(termsId) => {
                setEditingTermsId(termsId);
                setEditorMode("edit");
              }}
            />
          ) : (
            <AdminReviewEmptyState message="조건에 맞는 약관이 없습니다." />
          )}
        </div>

        {pagination && !termsQuery.isLoading && !termsQuery.isError ? (
          <div className="border-t border-border px-5 py-4">
            <AdminReviewPagination
              pagination={pagination}
              ariaLabel="약관 목록 페이지"
              onChangePage={(nextPage) => {
                navigateWithParams({ page: nextPage <= 1 ? null : String(nextPage) });
              }}
            />
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => {
          setEditorMode("create");
          setEditingTermsId(null);
        }}
        className="fixed right-5 bottom-5 left-5 z-30 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg md:hidden"
      >
        + 약관 작성
      </button>

      {editorMode ? (
        <AdminTermsEditorModal
          key={
            editorMode === "create"
              ? "create-terms"
              : detail
                ? `edit-terms-${String(detail.id)}-${detail.updatedAt}`
                : `edit-terms-loading-${String(editingTermsId ?? "none")}`
          }
          mode={editorMode}
          terms={editorMode === "edit" ? detail : null}
          isLoading={editorMode === "edit" ? detailQuery.isLoading : false}
          error={editorMode === "edit" ? detailQuery.error : null}
          isPending={isMutating}
          onClose={closeEditor}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onPublish={
            editorMode === "edit" && detail && isAdminTermsEditable(detail.status)
              ? () => setConfirmAction("publish")
              : null
          }
          onDelete={
            editorMode === "edit" && detail && isAdminTermsEditable(detail.status)
              ? () => setConfirmAction("delete")
              : null
          }
          onRetry={
            editorMode === "edit"
              ? () => {
                  void detailQuery.refetch();
                }
              : undefined
          }
        />
      ) : null}

      {confirmAction === "publish" && detail ? (
        <AdminTermsConfirmModal
          title="약관 게시"
          tone="accent"
          description={
            <>
              <span className="font-medium text-foreground">
                {ADMIN_TERMS_TYPE_LABELS[detail.type]} v{detail.version}
              </span>
              를 게시합니다. 같은 유형의 기존 게시본은 보관 처리되고, 이 버전이 사용자 화면에 즉시
              노출됩니다.
              <br />
              게시 후에는 내용을 수정할 수 없으며 되돌릴 수 없습니다.
            </>
          }
          confirmLabel="게시하기"
          pendingLabel="게시 중..."
          isPending={publishMutation.isPending}
          onClose={() => {
            if (!publishMutation.isPending) {
              setConfirmAction(null);
            }
          }}
          onConfirm={() => {
            void handlePublish();
          }}
        />
      ) : null}

      {confirmAction === "delete" && detail ? (
        <AdminTermsConfirmModal
          title="약관 삭제"
          description={
            <>
              <span className="font-medium text-foreground">{detail.title}</span> 초안을 삭제합니다.
              삭제 후에는 목록에서 다시 불러올 수 없습니다.
            </>
          }
          confirmLabel="삭제"
          pendingLabel="삭제 중..."
          isPending={deleteMutation.isPending}
          onClose={() => {
            if (!deleteMutation.isPending) {
              setConfirmAction(null);
            }
          }}
          onConfirm={() => {
            void handleDelete();
          }}
        />
      ) : null}

      {feedback ? (
        <AdminReviewFeedbackToast tone={feedback.tone} message={feedback.message} />
      ) : null}
    </section>
  );
}
