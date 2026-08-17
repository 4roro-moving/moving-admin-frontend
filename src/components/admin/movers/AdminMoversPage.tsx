"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Text from "@/components/admin/common/Text";
import { createMoverColumns } from "@/components/admin/movers/moverColumns";
import AdminListPagination from "@/components/admin/users/AdminListPagination";
import AdminListTable from "@/components/admin/users/AdminListTable";
import AdminListToolbar from "@/components/admin/users/AdminListToolbar";
import { useAdminMovers } from "@/hooks/useAdminMovers";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  getListSortDirection,
  toggleListSort,
  toggleRequiredListSort,
  type SortDirection,
} from "@/lib/utils/user/sort";
import {
  buildMoverListQueryString,
  type MoverListFilters,
} from "@/lib/utils/user/moversSearchParams";
import { useAdminListUrlFilters } from "@/hooks/useAdminListUrlFilters";
import type {
  AdminProfileFilterValue,
  AdminListOpenFilter,
  AdminAccountStatus,
} from "@/types/adminUser";

export default function AdminMoversPage({
  initialFilters,
}: {
  initialFilters: MoverListFilters;
}) {
  const router = useRouter();
  const {
    keywordInput,
    setKeywordInput,
    submitKeyword,
    clearKeyword,
    replaceFilters,
  } = useAdminListUrlFilters(initialFilters, buildMoverListQueryString);
  const {
    keyword,
    status,
    profile: profileFilter,
    fromDate,
    toDate,
    page,
    limit,
    sorts,
  } = initialFilters;
  const setStatus = useCallback(
    (value: "ALL" | AdminAccountStatus) =>
      replaceFilters({ status: value, page: 1 }),
    [replaceFilters],
  );
  const setProfileFilter = useCallback(
    (value: AdminProfileFilterValue) =>
      replaceFilters({ profile: value, page: 1 }),
    [replaceFilters],
  );
  const setFromDate = useCallback(
    (value: string) => replaceFilters({ fromDate: value, page: 1 }),
    [replaceFilters],
  );
  const setToDate = useCallback(
    (value: string) => replaceFilters({ toDate: value, page: 1 }),
    [replaceFilters],
  );
  const setPage = useCallback(
    (value: number) => replaceFilters({ page: value }),
    [replaceFilters],
  );
  const setLimit = useCallback(
    (value: number) => replaceFilters({ limit: value, page: 1 }),
    [replaceFilters],
  );
  const reportSort: SortDirection = getListSortDirection(
    sorts,
    "PENDING_DESC",
    "PENDING_ASC",
  );
  const confirmedSort: SortDirection = getListSortDirection(
    sorts,
    "CONFIRMED_DESC",
    "CONFIRMED_ASC",
  );
  const ratingSort: SortDirection = getListSortDirection(
    sorts,
    "RATING_DESC",
    "RATING_ASC",
  );
  const careerSort: SortDirection = getListSortDirection(
    sorts,
    "CAREER_DESC",
    "CAREER_ASC",
  );
  const joinedSort: SortDirection = sorts.includes("CREATED_AT_ASC")
    ? "asc"
    : "desc";
  const [openFilter, setOpenFilter] = useState<AdminListOpenFilter>(null);
  const { data, error, isError, isLoading, isPlaceholderData, refetch } =
    useAdminMovers({
      page,
      limit,
      keyword: keyword || undefined,
      status: status === "ALL" ? undefined : status,
      isProfileCompleted:
        profileFilter === "ALL" ? undefined : profileFilter === "COMPLETED",
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      sorts: sorts.length > 0 ? sorts : undefined,
    });

  const columns = useMemo(
    () =>
      createMoverColumns({
        status,
        profile: profileFilter,
        fromDate,
        toDate,
        reportSort,
        confirmedSort,
        ratingSort,
        careerSort,
        joinedSort,
        openFilter,
        setOpenFilter,
        setStatus,
        setProfile: setProfileFilter,
        setFromDate,
        setToDate,
        resetDate: () => {
          setFromDate("");
          setToDate("");
          setOpenFilter(null);
        },
        onReportSort: () => {
          replaceFilters({
            sorts: toggleListSort(sorts, "PENDING_DESC", "PENDING_ASC"),
            page: 1,
          });
        },
        onConfirmedSort: () => {
          replaceFilters({
            sorts: toggleListSort(sorts, "CONFIRMED_DESC", "CONFIRMED_ASC"),
            page: 1,
          });
        },
        onRatingSort: () => {
          replaceFilters({
            sorts: toggleListSort(sorts, "RATING_DESC", "RATING_ASC"),
            page: 1,
          });
        },
        onCareerSort: () => {
          replaceFilters({
            sorts: toggleListSort(sorts, "CAREER_DESC", "CAREER_ASC"),
            page: 1,
          });
        },
        onJoinedSort: () => {
          replaceFilters({
            sorts: toggleRequiredListSort(
              sorts,
              "CREATED_AT_DESC",
              "CREATED_AT_ASC",
            ),
            page: 1,
          });
        },
      }),
    [
      fromDate,
      careerSort,
      confirmedSort,
      joinedSort,
      openFilter,
      profileFilter,
      reportSort,
      ratingSort,
      replaceFilters,
      setFromDate,
      setProfileFilter,
      setStatus,
      setToDate,
      sorts,
      status,
      toDate,
    ],
  );
  const pagination = data?.pagination;
  return (
    <section className="flex w-full flex-col gap-3">
      <header>
        <Text as="p" variant="md-medium" className="text-muted">
          Movers
        </Text>
        <h1 className="text-3xl font-semibold text-foreground">기사 관리</h1>
        <Text as="p" variant="md-regular" className="mt-2 text-muted">
          이사업체 계정의 프로필과 이용 상태를 조회하고 관리합니다.
        </Text>
      </header>
      <AdminListToolbar
        title="기사 목록"
        totalCount={pagination?.totalCount ?? 0}
        searchValue={keywordInput}
        searchPlaceholder="이름, 닉네임 또는 이메일 검색"
        onSearchChange={setKeywordInput}
        onSearchClear={clearKeyword}
        onSearchSubmit={submitKeyword}
        limit={limit}
        isLimitOpen={openFilter === "limit"}
        onLimitToggle={() =>
          setOpenFilter(openFilter === "limit" ? null : "limit")
        }
        onLimitChange={(value) => {
          setLimit(value);
          setOpenFilter(null);
        }}
      />
      <div className="overflow-hidden rounded-20 border border-border bg-surface shadow-select">
        {isLoading ? (
          <p className="px-5 py-16 text-center text-sm text-muted">
            기사 목록을 불러오는 중입니다.
          </p>
        ) : null}
        {isError ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-rose-600">
              {getApiErrorMessage(error, "기사 목록을 불러오지 못했습니다.")}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-background-hover"
            >
              다시 시도
            </button>
          </div>
        ) : null}
        {!isLoading && !isError ? (
          <>
            <AdminListTable
              columns={columns}
              items={data?.items ?? []}
              emptyLabel="조건에 맞는 기사가 없습니다."
              minWidth="min-w-[1420px]"
              onRowClick={(mover) => router.push(`/movers/${mover.id}`)}
            />
            {pagination ? (
              <AdminListPagination
                pagination={pagination}
                isPreviousDisabled={isPlaceholderData || pagination.page === 1}
                isNextDisabled={isPlaceholderData || !pagination.hasNext}
                onPrevious={() => setPage(pagination.page - 1)}
                onNext={() => setPage(pagination.page + 1)}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
