"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  AdminReviewEmptyState,
  AdminReviewErrorState,
  AdminReviewFeedbackToast,
  AdminReviewLoadingState,
} from "@/components/admin/contents/AdminReviewListStates";
import AdminReviewPagination from "@/components/admin/contents/AdminReviewPagination";
import AdminReviewSearchBar from "@/components/admin/contents/AdminReviewSearchBar";
import { useAdminReportDetail, useAdminReportSummary } from "@/hooks/useAdminReportDetail";
import { useAdminReportModeration } from "@/hooks/useAdminReportModeration";
import { useAdminReports } from "@/hooks/useAdminReports";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { ADMIN_REPORT_LIST_PAGE_LIMIT } from "@/lib/constants/adminReports";
import type {
  AdminReportReason,
  AdminReportSort,
  AdminReportStatus,
  AdminReportTargetType,
} from "@/types/adminReport";

import AdminReportDetailCard from "./AdminReportDetailCard";
import AdminReportMetrics from "./AdminReportMetrics";
import AdminReportsTable from "./AdminReportsTable";
import AdminReportStatusFilters from "./AdminReportStatusFilters";

interface ModerationFeedback {
  tone: "error" | "success";
  message: string;
}

function parseSelectedReportId(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0 ? numeric : null;
}

export default function AdminReportsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedReportId = parseSelectedReportId(searchParams.get("reportId"));

  const [page, setPage] = useState(1);
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<AdminReportStatus | "ALL">("ALL");
  const [targetType, setTargetType] = useState<AdminReportTargetType | "ALL">("ALL");
  const [reason, setReason] = useState<AdminReportReason | "ALL">("ALL");
  const [sort, setSort] = useState<AdminReportSort>("LATEST");
  const [feedback, setFeedback] = useState<ModerationFeedback | null>(null);
  const hasInitializedSelectionRef = useRef(false);

  const listQuery = useMemo(
    () => ({
      page,
      limit: ADMIN_REPORT_LIST_PAGE_LIMIT,
      keyword: keyword || undefined,
      status,
      targetType,
      reason,
      sort,
    }),
    [keyword, page, reason, sort, status, targetType],
  );

  const reportsQuery = useAdminReports(listQuery);
  const summaryQuery = useAdminReportSummary();
  const detailQuery = useAdminReportDetail(selectedReportId);
  const moderationMutation = useAdminReportModeration();

  const items = useMemo(() => reportsQuery.data?.items ?? [], [reportsQuery.data?.items]);
  const pagination = reportsQuery.data?.pagination;

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

  useEffect(() => {
    if (!reportsQuery.data) {
      return;
    }

    if (items.length === 0) {
      hasInitializedSelectionRef.current = false;

      if (selectedReportId === null) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.delete("reportId");
      router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname, {
        scroll: false,
      });
      return;
    }

    const hasSelectedItemOnPage = selectedReportId !== null && items.some((item) => item.id === selectedReportId);
    if (hasSelectedItemOnPage) {
      hasInitializedSelectionRef.current = true;
      return;
    }

    if (hasInitializedSelectionRef.current && selectedReportId !== null) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("reportId", String(items[0].id));
    hasInitializedSelectionRef.current = true;
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [items, pathname, reportsQuery.data, router, searchParams, selectedReportId]);

  const handleSubmitSearch = () => {
    setKeyword(keywordInput.trim());
    setPage(1);
    hasInitializedSelectionRef.current = false;
  };

  const handleChangePage = (nextPage: number) => {
    hasInitializedSelectionRef.current = false;
    setPage(nextPage);
  };

  const handleSelectReport = (reportId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("reportId", String(reportId));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleModerate = async ({
    reportId,
    status: nextStatus,
    handlerNote,
  }: {
    reportId: number;
    status: "RESOLVED" | "REJECTED";
    handlerNote: string;
  }) => {
    const trimmedHandlerNote = handlerNote.trim();

    if (!trimmedHandlerNote) {
      setFeedback({
        tone: "error",
        message: "처리 메모를 입력해 주세요.",
      });
      return;
    }

    try {
      await moderationMutation.mutateAsync({
        reportId,
        payload: { status: nextStatus, handlerNote: trimmedHandlerNote },
      });
      setFeedback({
        tone: "success",
        message: nextStatus === "RESOLVED" ? "신고를 처리 완료했습니다." : "신고를 반려 처리했습니다.",
      });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "신고 처리에 실패했습니다."),
      });
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-foreground">신고 관리</h1>
        <p className="text-muted text-sm">
          신고 현황을 확인하고, 상세 검토 후 처리 완료 또는 반려 상태로 관리합니다.
        </p>
      </header>

      {summaryQuery.isLoading ? (
        <AdminReviewLoadingState message="신고 지표를 불러오는 중입니다." />
      ) : summaryQuery.isError ? (
        <AdminReviewErrorState
          error={summaryQuery.error}
          message="신고 지표를 불러오지 못했습니다."
          onRetry={() => {
            void summaryQuery.refetch();
          }}
        />
      ) : summaryQuery.data ? (
        <AdminReportMetrics summary={summaryQuery.data} />
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="border-border bg-surface flex min-w-0 flex-col gap-4 rounded-2xl border p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">신고 목록</h2>
              <p className="text-muted mt-1 text-sm">
                총 {pagination?.totalCount ?? 0}건
              </p>
            </div>
          </div>

          <AdminReportStatusFilters
            status={status}
            targetType={targetType}
            reason={reason}
            sort={sort}
            onChangeStatus={(nextStatus) => {
              setStatus(nextStatus);
              setPage(1);
              hasInitializedSelectionRef.current = false;
            }}
            onChangeTargetType={(nextTargetType) => {
              setTargetType(nextTargetType);
              setPage(1);
              hasInitializedSelectionRef.current = false;
            }}
            onChangeReason={(nextReason) => {
              setReason(nextReason);
              setPage(1);
              hasInitializedSelectionRef.current = false;
            }}
            onChangeSort={(nextSort) => {
              setSort(nextSort);
              setPage(1);
              hasInitializedSelectionRef.current = false;
            }}
          />

          <AdminReviewSearchBar
            value={keywordInput}
            onChange={setKeywordInput}
            onSubmit={handleSubmitSearch}
            inputId="admin-report-search"
            label="신고자 또는 신고 내용 검색"
            placeholder="신고자 또는 신고 내용을 검색해 주세요."
            className="w-full"
          />

          {reportsQuery.isLoading ? <AdminReviewLoadingState message="신고 목록을 불러오는 중입니다." /> : null}

          {reportsQuery.isError ? (
            <AdminReviewErrorState
              error={reportsQuery.error}
              message="신고 목록을 불러오지 못했습니다."
              onRetry={() => {
                void reportsQuery.refetch();
              }}
            />
          ) : null}

          {!reportsQuery.isLoading && !reportsQuery.isError ? (
            <>
              {items.length > 0 ? (
                <AdminReportsTable
                  items={items}
                  selectedReportId={selectedReportId}
                  onSelectReport={handleSelectReport}
                />
              ) : (
                <AdminReviewEmptyState message="조건에 맞는 신고가 없습니다." />
              )}

              {pagination ? (
                <AdminReviewPagination
                  pagination={pagination}
                  ariaLabel="신고 목록 페이지"
                  onChangePage={handleChangePage}
                />
              ) : null}
            </>
          ) : null}
        </div>

        <AdminReportDetailCard
          key={detailQuery.data?.id ?? selectedReportId ?? "empty-report"}
          report={detailQuery.data ?? null}
          isLoading={detailQuery.isLoading && selectedReportId !== null}
          error={detailQuery.error}
          isPending={moderationMutation.isPending}
          onModerate={handleModerate}
        />
      </div>

      {feedback ? <AdminReviewFeedbackToast tone={feedback.tone} message={feedback.message} /> : null}
    </section>
  );
}
