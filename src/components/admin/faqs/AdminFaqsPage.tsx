"use client";

import { useEffect, useMemo, useState } from "react";

import Search from "@/components/admin/common/Search";
import {
  AdminReviewEmptyState,
  AdminReviewErrorState,
  AdminReviewFeedbackToast,
  AdminReviewLoadingState,
} from "@/components/admin/contents/AdminReviewListStates";
import AdminListPagination from "@/components/admin/users/AdminListPagination";
import { useAdminFaqDetail } from "@/hooks/useAdminFaqDetail";
import { useAdminFaqs } from "@/hooks/useAdminFaqs";
import {
  useCreateAdminFaq,
  useDeleteAdminFaq,
  useUpdateAdminFaq,
} from "@/hooks/useAdminFaqMutations";
import { ADMIN_FAQ_LIST_PAGE_LIMIT } from "@/lib/api/adminFaqs";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";
import type {
  AdminFaq,
  CreateAdminFaqPayload,
  UpdateAdminFaqPayload,
} from "@/types/adminFaq";

import AdminFaqDeleteModal from "./AdminFaqDeleteModal";
import AdminFaqEditorModal from "./AdminFaqEditorModal";
import AdminFaqsTable from "./AdminFaqsTable";

type VisibilityFilter = "ALL" | "VISIBLE" | "HIDDEN";

interface FaqFeedback {
  tone: "error" | "success";
  message: string;
}

function FaqFilterChip({
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

export default function AdminFaqsPage() {
  const [page, setPage] = useState(1);
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [visibility, setVisibility] = useState<VisibilityFilter>("ALL");
  const [editorMode, setEditorMode] = useState<"create" | "edit" | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminFaq | null>(null);
  const [feedback, setFeedback] = useState<FaqFeedback | null>(null);

  const listQuery = useMemo(
    () => ({
      page,
      limit: ADMIN_FAQ_LIST_PAGE_LIMIT,
      keyword: keyword || undefined,
      isVisible: visibility === "ALL" ? undefined : visibility === "VISIBLE",
    }),
    [keyword, page, visibility],
  );

  const faqsQuery = useAdminFaqs(listQuery);
  const detailQuery = useAdminFaqDetail(editorMode === "edit" ? editingFaqId : null);
  const createMutation = useCreateAdminFaq();
  const updateMutation = useUpdateAdminFaq();
  const deleteMutation = useDeleteAdminFaq();

  const items = faqsQuery.data?.items ?? [];
  const pagination = faqsQuery.data?.pagination;

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
    setEditingFaqId(null);
  };

  const handleSearchSubmit = () => {
    setKeyword(keywordInput.trim());
    setPage(1);
  };

  const handleVisibilityChange = (nextVisibility: VisibilityFilter) => {
    setVisibility(nextVisibility);
    setPage(1);
  };

  const handleCreate = async (payload: CreateAdminFaqPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      closeEditor();
      setFeedback({
        tone: "success",
        message: "FAQ를 등록했습니다.",
      });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "FAQ 등록에 실패했습니다."),
      });
    }
  };

  const handleUpdate = async (faqId: number, payload: UpdateAdminFaqPayload) => {
    try {
      await updateMutation.mutateAsync({ faqId, payload });
      closeEditor();
      setFeedback({
        tone: "success",
        message: "FAQ를 수정했습니다.",
      });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "FAQ 수정에 실패했습니다."),
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
        message: "FAQ를 삭제했습니다.",
      });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "FAQ 삭제에 실패했습니다."),
      });
    }
  };

  return (
    <section className="flex flex-col gap-5 pb-24 md:pb-0">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-foreground">FAQ 관리</h1>
          <p className="text-sm text-muted">
            자주 묻는 질문을 작성하고 노출 상태를 관리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditorMode("create");
            setEditingFaqId(null);
          }}
          className="hidden shrink-0 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold whitespace-nowrap text-white transition hover:brightness-95 md:inline-flex"
        >
          + FAQ 작성
        </button>
      </header>

      <div className="rounded-20 border border-border bg-surface px-5 py-5 shadow-select">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <FaqFilterChip
              label="전체"
              active={visibility === "ALL"}
              onClick={() => handleVisibilityChange("ALL")}
            />
            <FaqFilterChip
              label="게시 중"
              active={visibility === "VISIBLE"}
              onClick={() => handleVisibilityChange("VISIBLE")}
            />
            <FaqFilterChip
              label="숨김"
              active={visibility === "HIDDEN"}
              onClick={() => handleVisibilityChange("HIDDEN")}
            />
          </div>

          <div className="w-full">
            <Search
              size="responsive"
              value={keywordInput}
              placeholder="질문 또는 답변 내용을 검색해 주세요."
              onChange={setKeywordInput}
              onClear={() => {
                setKeywordInput("");
                setKeyword("");
                setPage(1);
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
            <h2 className="text-lg font-semibold text-foreground">FAQ 목록</h2>
            <p className="mt-1 text-sm text-muted">총 {pagination?.totalCount ?? 0}건</p>
          </div>
        </div>

        <div className="px-5 py-5">
          {faqsQuery.isLoading ? (
            <AdminReviewLoadingState message="FAQ 목록을 불러오는 중입니다." />
          ) : faqsQuery.isError ? (
            <AdminReviewErrorState
              error={faqsQuery.error}
              message="FAQ 목록을 불러오지 못했습니다."
              onRetry={() => {
                void faqsQuery.refetch();
              }}
            />
          ) : items.length > 0 ? (
            <AdminFaqsTable
              items={items}
              onEditFaq={(faqId) => {
                setEditingFaqId(faqId);
                setEditorMode("edit");
              }}
            />
          ) : (
            <AdminReviewEmptyState message="조건에 맞는 FAQ가 없습니다." />
          )}
        </div>

        {pagination && !faqsQuery.isLoading && !faqsQuery.isError ? (
          <AdminListPagination
            pagination={pagination}
            isPreviousDisabled={pagination.page <= 1}
            isNextDisabled={!pagination.hasNext}
            onPrevious={() => {
              setPage((current) => Math.max(1, current - 1));
            }}
            onNext={() => {
              setPage((current) => current + 1);
            }}
          />
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => {
          setEditorMode("create");
          setEditingFaqId(null);
        }}
        className="fixed right-5 bottom-5 left-5 z-30 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg md:hidden"
      >
        + FAQ 작성
      </button>

      {editorMode ? (
        <AdminFaqEditorModal
          key={
            editorMode === "create"
              ? "create-faq"
              : detailQuery.data
                ? `edit-faq-${detailQuery.data.id}-${detailQuery.data.updatedAt}`
                : `edit-faq-loading-${editingFaqId ?? "none"}`
          }
          mode={editorMode}
          faq={editorMode === "edit" ? detailQuery.data ?? null : null}
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
        <AdminFaqDeleteModal
          faq={deleteTarget}
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

      {feedback ? <AdminReviewFeedbackToast tone={feedback.tone} message={feedback.message} /> : null}
    </section>
  );
}
