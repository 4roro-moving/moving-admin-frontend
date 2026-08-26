"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import AdminFeedbackToast from "@/components/admin/common/AdminFeedbackToast";
import Search from "@/components/admin/common/Search";
import {
  AdminReviewEmptyState,
  AdminReviewErrorState,
  AdminReviewLoadingState,
} from "@/components/admin/contents/AdminReviewListStates";
import AdminReviewPagination from "@/components/admin/contents/AdminReviewPagination";
import { FilterOption, TableFilter } from "@/components/admin/users/TableFilter";
import { useAdminFeedbackToast } from "@/hooks/common/useAdminFeedbackToast";
import { useAdminNoticeDetail } from "@/hooks/useAdminNoticeDetail";
import { useAdminNotices } from "@/hooks/useAdminNotices";
import {
  useCreateAdminNotice,
  useDeleteAdminNotice,
  useUpdateAdminNotice,
} from "@/hooks/useAdminNoticeMutations";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { ADMIN_NOTICE_LIST_PAGE_LIMIT } from "@/lib/api/adminNotices";
import {
  buildUpdatedSearchParams,
  parseBooleanSearchParam,
  parseKeywordSearchParam,
  parsePositivePageParam,
} from "@/lib/utils/adminListSearchParams";
import { cn } from "@/lib/utils/cn";
import type {
  AdminNotice,
  CreateAdminNoticePayload,
  NoticeAudience,
  UpdateAdminNoticePayload,
} from "@/types/adminNotice";

import AdminNoticeDeleteModal from "./AdminNoticeDeleteModal";
import AdminNoticeEditorModal from "./AdminNoticeEditorModal";
import AdminNoticesTable from "./AdminNoticesTable";

type AudienceFilter = NoticeAudience | "ALL";
type VisibilityFilter = "ALL" | "VISIBLE" | "HIDDEN";

interface NoticeFeedback {
  tone: "error" | "success";
  message: string;
}

function NoticeFilterChip({
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

function getAudienceLabel(value: AudienceFilter) {
  switch (value) {
    case "CUSTOMER":
      return "고객";
    case "MOVER":
      return "기사";
    default:
      return "전체";
  }
}

export default function AdminNoticesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parsePositivePageParam(searchParams.get("page"));
  const keyword = parseKeywordSearchParam(searchParams.get("keyword"));
  const audienceParam = searchParams.get("audience");
  const visibilityParam = parseBooleanSearchParam(searchParams.get("visibility"));
  const audience: AudienceFilter =
    audienceParam === "CUSTOMER" || audienceParam === "MOVER" ? audienceParam : "ALL";
  const visibility: VisibilityFilter =
    visibilityParam === undefined ? "ALL" : visibilityParam ? "VISIBLE" : "HIDDEN";
  const listStateKey = JSON.stringify({ page, keyword, audience, visibility });

  const [keywordDraft, setKeywordDraft] = useState({ key: "", value: "" });
  const [isAudienceFilterOpen, setIsAudienceFilterOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit" | null>(null);
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminNotice | null>(null);
  const [feedback, setFeedback] = useAdminFeedbackToast<NoticeFeedback>();
  const keywordInput = keywordDraft.key === listStateKey ? keywordDraft.value : keyword;

  const listQuery = useMemo(
    () => ({
      page,
      limit: ADMIN_NOTICE_LIST_PAGE_LIMIT,
      keyword: keyword || undefined,
      audience: audience === "ALL" ? undefined : audience,
      isVisible:
        visibility === "ALL" ? undefined : visibility === "VISIBLE",
    }),
    [audience, keyword, page, visibility],
  );

  const noticesQuery = useAdminNotices(listQuery);
  const detailQuery = useAdminNoticeDetail(
    editorMode === "edit" ? editingNoticeId : null,
  );
  const createMutation = useCreateAdminNotice();
  const updateMutation = useUpdateAdminNotice();
  const deleteMutation = useDeleteAdminNotice();

  const items = noticesQuery.data?.items ?? [];
  const pagination = noticesQuery.data?.pagination;

  const closeEditor = () => {
    setEditorMode(null);
    setEditingNoticeId(null);
  };

  const navigateWithParams = (updates: Record<string, string | null | undefined>) => {
    const nextParams = buildUpdatedSearchParams(searchParams, updates);
    const nextUrl = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;

    router.push(nextUrl, { scroll: false });
  };

  const handleSearchSubmit = () => {
    const trimmedKeyword = keywordInput.trim();
    navigateWithParams({
      page: null,
      keyword: trimmedKeyword || null,
    });
  };

  const handleVisibilityChange = (nextVisibility: VisibilityFilter) => {
    navigateWithParams({
      page: null,
      visibility:
        nextVisibility === "ALL" ? null : String(nextVisibility === "VISIBLE"),
    });
  };

  const handleAudienceChange = (nextAudience: AudienceFilter) => {
    navigateWithParams({
      page: null,
      audience: nextAudience === "ALL" ? null : nextAudience,
    });
    setIsAudienceFilterOpen(false);
  };

  const handleCreate = async (payload: CreateAdminNoticePayload) => {
    try {
      await createMutation.mutateAsync(payload);
      closeEditor();
      setFeedback({
        tone: "success",
        message: "공지사항을 등록했습니다.",
      });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "공지사항 등록에 실패했습니다."),
      });
    }
  };

  const handleUpdate = async (
    noticeId: number,
    payload: UpdateAdminNoticePayload,
  ) => {
    try {
      await updateMutation.mutateAsync({ noticeId, payload });
      closeEditor();
      setFeedback({
        tone: "success",
        message: "공지사항을 수정했습니다.",
      });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "공지사항 수정에 실패했습니다."),
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      closeEditor();
      setFeedback({
        tone: "success",
        message: "공지사항을 삭제했습니다.",
      });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "공지사항 삭제에 실패했습니다."),
      });
    }
  };

  return (
    <section className="flex flex-col gap-5 pb-24 md:pb-0">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-foreground">공지사항 관리</h1>
          <p className="text-sm text-muted">
            사용자에게 노출할 공지사항을 등록하고, 상태별로 조회 및 수정합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditorMode("create");
            setEditingNoticeId(null);
          }}
          className="hidden shrink-0 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold whitespace-nowrap text-white transition hover:brightness-95 md:inline-flex"
        >
          + 공지 작성
        </button>
      </header>

      <div className="rounded-20 border border-border bg-surface px-5 py-5 shadow-select">
        <div className="flex flex-col gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2 md:flex-nowrap md:gap-1.5 lg:gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2 md:flex-nowrap md:gap-1.5 lg:gap-2">
              <NoticeFilterChip
                label="전체"
                active={visibility === "ALL"}
                onClick={() => handleVisibilityChange("ALL")}
              />
              <NoticeFilterChip
                label="게시중"
                active={visibility === "VISIBLE"}
                onClick={() => handleVisibilityChange("VISIBLE")}
              />
              <NoticeFilterChip
                label="숨김"
                active={visibility === "HIDDEN"}
                onClick={() => handleVisibilityChange("HIDDEN")}
              />
              <TableFilter
                label={`대상: ${getAudienceLabel(audience)}`}
                isOpen={isAudienceFilterOpen}
                onToggle={() => {
                  setIsAudienceFilterOpen((current) => !current);
                }}
                align="start"
                isActive={audience !== "ALL"}
                triggerClassName="h-[34px] rounded-full border border-border bg-surface px-3 text-muted"
              >
                {(["ALL", "CUSTOMER", "MOVER"] as const).map((value) => (
                  <FilterOption
                    key={value}
                    selected={audience === value}
                    onClick={() => handleAudienceChange(value)}
                  >
                    {getAudienceLabel(value)}
                  </FilterOption>
                ))}
              </TableFilter>
            </div>
          </div>

          <div className="w-full">
            <Search
              size="responsive"
              value={keywordInput}
              placeholder="제목 또는 내용을 검색해 주세요."
              onChange={(nextKeyword) => {
                setKeywordDraft({
                  key: listStateKey,
                  value: nextKeyword,
                });
              }}
              onClear={() => {
                setKeywordDraft({
                  key: listStateKey,
                  value: "",
                });
                navigateWithParams({
                  page: null,
                  keyword: null,
                });
              }}
              onSubmit={handleSearchSubmit}
              className="w-full md:max-w-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-20 border border-border bg-surface shadow-select">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">공지사항 목록</h2>
            <p className="mt-1 text-sm text-muted">
              총 {pagination?.totalCount ?? 0}건
            </p>
          </div>
        </div>

        <div className="px-5 py-5">
          {noticesQuery.isLoading ? (
            <AdminReviewLoadingState message="공지사항 목록을 불러오는 중입니다." />
          ) : noticesQuery.isError ? (
            <AdminReviewErrorState
              error={noticesQuery.error}
              message="공지사항 목록을 불러오지 못했습니다."
              onRetry={() => {
                void noticesQuery.refetch();
              }}
            />
          ) : items.length > 0 ? (
            <AdminNoticesTable
              items={items}
              onEditNotice={(noticeId) => {
                setEditingNoticeId(noticeId);
                setEditorMode("edit");
              }}
            />
          ) : (
            <AdminReviewEmptyState message="조건에 맞는 공지사항이 없습니다." />
          )}
        </div>

        {pagination && !noticesQuery.isLoading && !noticesQuery.isError ? (
          <div className="border-t border-border px-5 py-4">
            <AdminReviewPagination
              pagination={pagination}
              ariaLabel="공지사항 목록 페이지"
              onChangePage={(nextPage) => {
                navigateWithParams({
                  page: nextPage <= 1 ? null : String(nextPage),
                });
              }}
            />
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => {
          setEditorMode("create");
          setEditingNoticeId(null);
        }}
        className="fixed right-5 bottom-5 left-5 z-30 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg md:hidden"
      >
        + 공지 작성
      </button>

      {editorMode ? (
        <AdminNoticeEditorModal
          key={
            editorMode === "create"
              ? "create-notice"
              : detailQuery.data
                ? `edit-notice-${detailQuery.data.id}-${detailQuery.data.updatedAt}`
                : `edit-notice-loading-${editingNoticeId ?? "none"}`
          }
          mode={editorMode}
          notice={editorMode === "edit" ? detailQuery.data ?? null : null}
          isLoading={editorMode === "edit" ? detailQuery.isLoading : false}
          error={editorMode === "edit" ? detailQuery.error : null}
          isPending={
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending
          }
          onClose={closeEditor}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={
            editorMode === "edit" && detailQuery.data
              ? () => {
                  setDeleteTarget(detailQuery.data);
                }
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

      {deleteTarget ? (
        <AdminNoticeDeleteModal
          notice={deleteTarget}
          isPending={deleteMutation.isPending}
          onClose={() => {
            if (!deleteMutation.isPending) {
              setDeleteTarget(null);
            }
          }}
          onConfirm={() => {
            void handleDelete();
          }}
        />
      ) : null}

      {feedback ? (
        <AdminFeedbackToast tone={feedback.tone} message={feedback.message} />
      ) : null}
    </section>
  );
}
