"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Text from "@/components/admin/common/Text";
import { createCustomerColumns } from "@/components/admin/customers/customerColumns";
import AdminListPagination from "@/components/admin/users/AdminListPagination";
import AdminListTable from "@/components/admin/users/AdminListTable";
import AdminListToolbar from "@/components/admin/users/AdminListToolbar";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import { useAdminListUrlFilters } from "@/hooks/useAdminListUrlFilters";
import {
  buildCustomerListQueryString,
  parseCustomerListFilters,
  type CustomerListFilters,
} from "@/lib/utils/user/customersSearchParams";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  getListSortDirection,
  toggleListSort,
  toggleRequiredListSort,
  type SortDirection,
} from "@/lib/utils/user/sort";
import type { AdminAccountStatus } from "@/types/adminUser";
import type {
  AdminCustomerAuthProviderFilter,
  AdminCustomerOpenFilter,
} from "@/types/adminCustomer";
import type { AdminProfileFilterValue } from "@/types/adminUser";

function getCustomerListFilters(
  searchParams: URLSearchParams,
): CustomerListFilters {
  const params: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    const currentValue = params[key];
    params[key] = currentValue
      ? Array.isArray(currentValue)
        ? [...currentValue, value]
        : [currentValue, value]
      : value;
  });

  return parseCustomerListFilters(params);
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilters = useMemo(
    () => getCustomerListFilters(searchParams),
    [searchParams],
  );
  const {
    keywordInput,
    setKeywordInput,
    submitKeyword,
    clearKeyword,
    replaceFilters,
  } = useAdminListUrlFilters(initialFilters, buildCustomerListQueryString);
  const {
    keyword,
    status,
    profile: profileFilter,
    authProvider,
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
  const setAuthProvider = useCallback(
    (value: AdminCustomerAuthProviderFilter) =>
      replaceFilters({ authProvider: value, page: 1 }),
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
  const openInquirySort: SortDirection = getListSortDirection(
    sorts,
    "OPEN_INQUIRY_DESC",
    "OPEN_INQUIRY_ASC",
  );
  const joinedSort: SortDirection = sorts.includes("CREATED_AT_ASC")
    ? "asc"
    : "desc";
  const [openFilter, setOpenFilter] = useState<AdminCustomerOpenFilter>(null);

  const { data, error, isError, isLoading, isPlaceholderData, refetch } =
    useAdminCustomers({
      page,
      limit,
      keyword: keyword || undefined,
      status: status === "ALL" ? undefined : status,
      authProvider: authProvider === "ALL" ? undefined : authProvider,
      isProfileCompleted:
        profileFilter === "ALL" ? undefined : profileFilter === "COMPLETED",
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      sorts: sorts.length > 0 ? sorts : undefined,
    });

  const columns = useMemo(
    () =>
      createCustomerColumns({
        status,
        profile: profileFilter,
        authProvider,
        fromDate,
        toDate,
        reportSort,
        openInquirySort,
        joinedSort,
        openFilter,
        setOpenFilter,
        setStatus,
        setProfile: setProfileFilter,
        setAuthProvider,
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
        onOpenInquirySort: () => {
          replaceFilters({
            sorts: toggleListSort(
              sorts,
              "OPEN_INQUIRY_DESC",
              "OPEN_INQUIRY_ASC",
            ),
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
      authProvider,
      fromDate,
      joinedSort,
      openFilter,
      openInquirySort,
      profileFilter,
      reportSort,
      replaceFilters,
      setAuthProvider,
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
        <h1 className="text-3xl font-semibold text-foreground">고객 관리</h1>
        <Text as="p" variant="md-regular" className="mt-2 text-muted">
          일반 고객(Customer) 계정의 가입 정보와 이용 상태를 조회하고
          관리합니다.
        </Text>
      </header>
      <AdminListToolbar
        title="고객 목록"
        totalCount={pagination?.totalCount ?? 0}
        searchValue={keywordInput}
        searchPlaceholder="이름 또는 이메일 검색"
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
            고객 목록을 불러오는 중입니다.
          </p>
        ) : null}
        {isError ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-rose-600">
              {getApiErrorMessage(error, "고객 목록을 불러오지 못했습니다.")}
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
              emptyLabel="조건에 맞는 회원이 없습니다."
              minWidth="min-w-[1120px]"
              onRowClick={(member) => router.push(`/customers/${member.id}`)}
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
