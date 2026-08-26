"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AdminFeedbackToast from "@/components/admin/common/AdminFeedbackToast";
import Search from "@/components/admin/common/Search";
import {
  AdminReviewEmptyState,
  AdminReviewErrorState,
  AdminReviewLoadingState,
} from "@/components/admin/contents/AdminReviewListStates";
import AdminReviewPagination from "@/components/admin/contents/AdminReviewPagination";
import { useAdminInquiryDetail } from "@/hooks/useAdminInquiryDetail";
import { useAdminInquiries } from "@/hooks/useAdminInquiries";
import {
  useAnswerAdminInquiry,
  useCloseAdminInquiry,
} from "@/hooks/useAdminInquiryMutations";
import { ADMIN_INQUIRY_LIST_PAGE_LIMIT } from "@/lib/api/adminInquiries";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  buildUpdatedSearchParams,
  parseBooleanSearchParam,
  parseKeywordSearchParam,
  parsePositivePageParam,
} from "@/lib/utils/adminListSearchParams";
import { cn } from "@/lib/utils/cn";
import type { AdminInquiryStatus } from "@/types/adminInquiry";

import AdminInquiryDetailCard from "./AdminInquiryDetailCard";
import AdminInquiriesList from "./AdminInquiriesList";

type InquiryStatusFilter = AdminInquiryStatus | "ALL";

interface InquiryFeedback {
  tone: "error" | "success";
  message: string;
}

function InquiryFilterChip({
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

function parseSelectedInquiryId(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0 ? numeric : null;
}

export default function AdminInquiriesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = parsePositivePageParam(searchParams.get("page"));
  const keyword = parseKeywordSearchParam(searchParams.get("keyword"));
  const statusParam = searchParams.get("status");
  const openOnly = parseBooleanSearchParam(searchParams.get("openOnly"));
  const selectedInquiryId = parseSelectedInquiryId(searchParams.get("inquiryId"));
  const status: InquiryStatusFilter =
    statusParam === "OPEN" || statusParam === "ANSWERED" || statusParam === "CLOSED"
      ? statusParam
      : "ALL";
  const listStateKey = JSON.stringify({ page, keyword, status, openOnly });

  const [isSheetLayout, setIsSheetLayout] = useState(false);
  const [keywordDraft, setKeywordDraft] = useState({ key: "", value: "" });
  const [feedback, setFeedback] = useState<InquiryFeedback | null>(null);
  const hasInitializedSelectionRef = useRef(false);
  const keywordInput = keywordDraft.key === listStateKey ? keywordDraft.value : keyword;

  const listQuery = useMemo(
    () => ({
      page,
      limit: ADMIN_INQUIRY_LIST_PAGE_LIMIT,
      keyword: keyword || undefined,
      status: status === "ALL" ? undefined : status,
      openOnly,
    }),
    [keyword, openOnly, page, status],
  );

  const inquiriesQuery = useAdminInquiries(listQuery);
  const detailQuery = useAdminInquiryDetail(selectedInquiryId);
  const answerMutation = useAnswerAdminInquiry();
  const closeMutation = useCloseAdminInquiry();

  const items = useMemo(() => inquiriesQuery.data?.items ?? [], [inquiriesQuery.data?.items]);
  const pagination = inquiriesQuery.data?.pagination;

  useEffect(() => {
    const sheetMediaQuery = window.matchMedia("(max-width: 1279px)");
    const applyLayout = (matches: boolean) => {
      setIsSheetLayout(matches);
    };

    applyLayout(sheetMediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyLayout(event.matches);
    };

    sheetMediaQuery.addEventListener("change", handleChange);
    return () => {
      sheetMediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isSheetLayout || selectedInquiryId === null) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isSheetLayout, selectedInquiryId]);

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
    if (!inquiriesQuery.data) {
      return;
    }

    if (items.length === 0) {
      hasInitializedSelectionRef.current = false;

      if (selectedInquiryId === null) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.delete("inquiryId");
      router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname, {
        scroll: false,
      });
      return;
    }

    const hasSelectedItemOnPage =
      selectedInquiryId !== null && items.some((item) => item.id === selectedInquiryId);

    if (isSheetLayout) {
      if (!hasSelectedItemOnPage && selectedInquiryId !== null) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("inquiryId");
        router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname, {
          scroll: false,
        });
      }
      return;
    }

    if (hasSelectedItemOnPage) {
      hasInitializedSelectionRef.current = true;
      return;
    }

    if (hasInitializedSelectionRef.current && selectedInquiryId !== null) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("inquiryId", String(items[0].id));
    hasInitializedSelectionRef.current = true;
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    inquiriesQuery.data,
    isSheetLayout,
    items,
    pathname,
    router,
    searchParams,
    selectedInquiryId,
  ]);

  const handleSearchSubmit = () => {
    const trimmedKeyword = keywordInput.trim();
    hasInitializedSelectionRef.current = false;
    const nextParams = buildUpdatedSearchParams(searchParams, {
      page: null,
      keyword: trimmedKeyword || null,
    });
    const nextUrl = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
    router.push(nextUrl, { scroll: false });
  };

  const handleChangePage = (nextPage: number) => {
    hasInitializedSelectionRef.current = false;
    const nextParams = buildUpdatedSearchParams(searchParams, {
      page: nextPage <= 1 ? null : String(nextPage),
    });
    const nextUrl = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
    router.push(nextUrl, { scroll: false });
  };

  const handleSelectInquiry = (inquiryId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("inquiryId", String(inquiryId));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCloseDetail = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("inquiryId");
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false,
    });
  };

  const handleSubmitAnswer = async (content: string) => {
    if (selectedInquiryId === null) {
      setFeedback({
        tone: "error",
        message: "문의를 먼저 선택해 주세요.",
      });
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setFeedback({
        tone: "error",
        message: "답변 내용을 입력해 주세요.",
      });
      return;
    }

    try {
      await answerMutation.mutateAsync({
        inquiryId: selectedInquiryId,
        payload: { content: trimmedContent },
      });
      setFeedback({
        tone: "success",
        message: "답변을 등록했습니다.",
      });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "답변 등록에 실패했습니다."),
      });
      throw exception;
    }
  };

  const handleSubmitClose = async () => {
    if (selectedInquiryId === null) {
      setFeedback({
        tone: "error",
        message: "문의를 먼저 선택해 주세요.",
      });
      return;
    }

    try {
      await closeMutation.mutateAsync(selectedInquiryId);
      setFeedback({
        tone: "success",
        message: "문의를 종료했습니다.",
      });
    } catch (exception) {
      setFeedback({
        tone: "error",
        message: getApiErrorMessage(exception, "문의 종료에 실패했습니다."),
      });
      throw exception;
    }
  };

  return (
    <section className="flex flex-col gap-5 pb-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-foreground">문의 관리</h1>
        <p className="text-sm text-muted">
          고객과 기사님의 문의를 확인하고 답변 상태를 관리합니다.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="overflow-hidden rounded-20 border border-border bg-surface shadow-select">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">문의 목록</h2>
                <p className="mt-1 text-sm text-muted">
                  총 {pagination?.totalCount ?? 0}건
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <InquiryFilterChip
                label="전체"
                active={status === "ALL"}
                onClick={() => {
                  hasInitializedSelectionRef.current = false;
                  const nextParams = buildUpdatedSearchParams(searchParams, {
                    page: null,
                    status: null,
                  });
                  const nextUrl =
                    nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
                  router.push(nextUrl, { scroll: false });
                }}
              />
              <InquiryFilterChip
                label="답변 대기"
                active={status === "OPEN"}
                onClick={() => {
                  hasInitializedSelectionRef.current = false;
                  const nextParams = buildUpdatedSearchParams(searchParams, {
                    page: null,
                    status: "OPEN",
                  });
                  const nextUrl =
                    nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
                  router.push(nextUrl, { scroll: false });
                }}
              />
              <InquiryFilterChip
                label="답변 완료"
                active={status === "ANSWERED"}
                onClick={() => {
                  hasInitializedSelectionRef.current = false;
                  const nextParams = buildUpdatedSearchParams(searchParams, {
                    page: null,
                    status: "ANSWERED",
                  });
                  const nextUrl =
                    nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
                  router.push(nextUrl, { scroll: false });
                }}
              />
              <InquiryFilterChip
                label="종료"
                active={status === "CLOSED"}
                onClick={() => {
                  hasInitializedSelectionRef.current = false;
                  const nextParams = buildUpdatedSearchParams(searchParams, {
                    page: null,
                    status: "CLOSED",
                  });
                  const nextUrl =
                    nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
                  router.push(nextUrl, { scroll: false });
                }}
              />
            </div>

            <div className="mt-4">
              <Search
                size="responsive"
                value={keywordInput}
                placeholder="문의 제목을 검색해 주세요."
                onChange={(nextKeyword) => {
                  setKeywordDraft({
                    key: listStateKey,
                    value: nextKeyword,
                  });
                }}
                onClear={() => {
                  hasInitializedSelectionRef.current = false;
                  setKeywordDraft({
                    key: listStateKey,
                    value: "",
                  });
                  const nextParams = buildUpdatedSearchParams(searchParams, {
                    page: null,
                    keyword: null,
                  });
                  const nextUrl =
                    nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
                  router.push(nextUrl, { scroll: false });
                }}
                onSubmit={handleSearchSubmit}
                className="w-full md:max-w-none"
              />
            </div>
          </div>

          <div className="px-5 py-5">
            {inquiriesQuery.isLoading ? (
              <AdminReviewLoadingState message="문의 목록을 불러오는 중입니다." />
            ) : inquiriesQuery.isError ? (
              <AdminReviewErrorState
                error={inquiriesQuery.error}
                message="문의 목록을 불러오지 못했습니다."
                onRetry={() => {
                  void inquiriesQuery.refetch();
                }}
              />
            ) : items.length > 0 ? (
              <AdminInquiriesList
                items={items}
                selectedInquiryId={selectedInquiryId}
                onSelectInquiry={handleSelectInquiry}
              />
            ) : (
              <AdminReviewEmptyState message="조건에 맞는 문의가 없습니다." />
            )}
          </div>

          {pagination && !inquiriesQuery.isLoading && !inquiriesQuery.isError ? (
            <div className="border-t border-border px-5 py-4">
              <AdminReviewPagination
                pagination={pagination}
                ariaLabel="문의 목록 페이지"
                onChangePage={handleChangePage}
              />
            </div>
          ) : null}
        </div>

        <div className="hidden xl:block">
          <AdminInquiryDetailCard
            key={detailQuery.data?.id ?? selectedInquiryId ?? "empty-inquiry"}
            inquiry={detailQuery.data ?? null}
            isLoading={detailQuery.isLoading && selectedInquiryId !== null}
            error={detailQuery.error}
            isAnswerPending={answerMutation.isPending}
            isClosePending={closeMutation.isPending}
            onSubmitAnswer={handleSubmitAnswer}
            onSubmitClose={handleSubmitClose}
          />
        </div>
      </div>

      {isSheetLayout && selectedInquiryId !== null ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          role="presentation"
          onClick={handleCloseDetail}
        >
          <div
            className="fixed inset-x-0 bottom-0 z-50 xl:hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <AdminInquiryDetailCard
              key={detailQuery.data?.id ?? selectedInquiryId}
              inquiry={detailQuery.data ?? null}
              isLoading={detailQuery.isLoading}
              error={detailQuery.error}
              isAnswerPending={answerMutation.isPending}
              isClosePending={closeMutation.isPending}
              onSubmitAnswer={handleSubmitAnswer}
              onSubmitClose={handleSubmitClose}
              onCloseDetail={handleCloseDetail}
              variant="sheet"
            />
          </div>
        </div>
      ) : null}

      {feedback ? <AdminFeedbackToast tone={feedback.tone} message={feedback.message} /> : null}
    </section>
  );
}
