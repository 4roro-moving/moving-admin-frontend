"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Text from "@/components/admin/common/Text";
import { createMemberColumns } from "@/components/admin/members/memberColumns";
import AdminListPagination from "@/components/admin/users/AdminListPagination";
import AdminListTable from "@/components/admin/users/AdminListTable";
import AdminListToolbar from "@/components/admin/users/AdminListToolbar";
import { useAdminMembers } from "@/hooks/useAdminMembers";
import { useAdminListUrlFilters } from "@/hooks/useAdminListUrlFilters";
import {
  buildMemberListQueryString,
  type MemberListFilters,
} from "@/lib/utils/admin/membersSearchParams";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { nextSortDirection, type SortDirection } from "@/lib/utils/user/sort";
import type {
  AdminMemberAuthProviderFilter,
  AdminMemberOpenFilter,
  AdminMemberStatus,
} from "@/types/adminMember";
import type { AdminProfileFilterValue } from "@/types/adminUser";

export default function AdminMembersPage({
  initialFilters,
}: {
  initialFilters: MemberListFilters;
}) {
  const router = useRouter();
  const {
    keywordInput,
    setKeywordInput,
    submitKeyword,
    clearKeyword,
    replaceFilters,
  } = useAdminListUrlFilters(initialFilters, buildMemberListQueryString);
  const {
    keyword,
    status,
    profile: profileFilter,
    authProvider,
    fromDate,
    toDate,
    page,
    limit,
    sort,
  } = initialFilters;
  const setStatus = useCallback(
    (value: "ALL" | AdminMemberStatus) =>
      replaceFilters({ status: value, page: 1 }),
    [replaceFilters],
  );
  const setProfileFilter = useCallback(
    (value: AdminProfileFilterValue) => replaceFilters({ profile: value, page: 1 }),
    [replaceFilters],
  );
  const setAuthProvider = useCallback(
    (value: AdminMemberAuthProviderFilter) =>
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
  const reportSort: SortDirection =
    sort === "PENDING_DESC" ? "desc" : sort === "PENDING_ASC" ? "asc" : "none";
  const joinedSort: SortDirection =
    sort === "OLDEST" ? "asc" : sort === "LATEST" ? "desc" : "none";
  const [openFilter, setOpenFilter] = useState<AdminMemberOpenFilter>(null);

  const { data, error, isError, isLoading, isPlaceholderData, refetch } =
    useAdminMembers({
      page,
      limit,
      keyword: keyword || undefined,
      status: status === "ALL" ? undefined : status,
      authProvider: authProvider === "ALL" ? undefined : authProvider,
      isProfileCompleted:
        profileFilter === "ALL" ? undefined : profileFilter === "COMPLETED",
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      sorts:
        sort === "OLDEST"
          ? ["CREATED_AT_ASC"]
          : sort === "PENDING_DESC" || sort === "PENDING_ASC"
            ? [sort]
            : ["CREATED_AT_DESC"],
    });

  const columns = useMemo(
    () =>
      createMemberColumns({
        status,
        profile: profileFilter,
        authProvider,
        fromDate,
        toDate,
        reportSort,
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
          const nextSort = nextSortDirection(reportSort);
          replaceFilters({
            sort:
              nextSort === "desc"
                ? "PENDING_DESC"
                : nextSort === "asc"
                  ? "PENDING_ASC"
                  : "LATEST",
            page: 1,
          });
        },
        onJoinedSort: () => {
          const nextSort = nextSortDirection(joinedSort);
          replaceFilters({
            sort: nextSort === "asc" ? "OLDEST" : "LATEST",
            page: 1,
          });
        },
      }),
    [
      authProvider,
      fromDate,
      joinedSort,
      openFilter,
      profileFilter,
      reportSort,
      replaceFilters,
      setAuthProvider,
      setFromDate,
      setProfileFilter,
      setStatus,
      setToDate,
      status,
      toDate,
    ],
  );

  const pagination = data?.pagination;
  return (
    <section className="flex w-full flex-col gap-3">
      <header>
        <Text as="p" variant="md-medium" className="text-muted">
          Members
        </Text>
        <h1 className="text-3xl font-semibold text-foreground">회원 관리</h1>
        <Text as="p" variant="md-regular" className="mt-2 text-muted">
          일반 고객(Customer) 계정의 가입 정보와 이용 상태를 조회하고
          관리합니다.
        </Text>
      </header>
      <AdminListToolbar
        title="회원 목록"
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
          setPage(1);
          setOpenFilter(null);
        }}
      />
      <div className="overflow-hidden rounded-20 border border-border bg-surface shadow-select">
        {isLoading ? (
          <p className="px-5 py-16 text-center text-sm text-muted">
            회원 목록을 불러오는 중입니다.
          </p>
        ) : null}
        {isError ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-rose-600">
              {getApiErrorMessage(error, "회원 목록을 불러오지 못했습니다.")}
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
              onRowClick={(member) => router.push(`/members/${member.id}`)}
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
