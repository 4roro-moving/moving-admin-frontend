import type {
  AdminAccountStatus,
  AdminProfileFilterValue,
} from "@/types/adminUser";
import {
  getSearchParam,
  parsePositiveInteger,
  type SearchParamsInput,
} from "@/lib/utils/urlSearchParams";

export type AdminListStatusFilter = "ALL" | AdminAccountStatus;

export interface AdminListSearchFilters<TSort extends string> {
  keyword: string;
  status: AdminListStatusFilter;
  profile: AdminProfileFilterValue;
  fromDate: string;
  toDate: string;
  sorts: TSort[];
  page: number;
  limit: number;
}

export function parseAdminListStatus(
  value: string | undefined,
): AdminListStatusFilter {
  if (value === "ACTIVE" || value === "SUSPENDED" || value === "WITHDRAWN") {
    return value;
  }

  return "ALL";
}

export function parseAdminListProfile(
  value: string | undefined,
): AdminProfileFilterValue {
  if (value === "COMPLETED" || value === "INCOMPLETE") {
    return value;
  }

  return "ALL";
}

/**
 * 반복 쿼리 파라미터 `sorts`에서 허용된 정렬값만 남기고 중복을 제거합니다.
 * URL에 선언된 순서를 유지하므로 API의 다중 정렬 우선순위도 유지됩니다.
 */
export function parseAdminListSorts<TSort extends string>(
  params: SearchParamsInput,
  allowedSorts: ReadonlySet<TSort>,
): TSort[] {
  const value = params.sorts;
  const rawSorts = Array.isArray(value) ? value : value ? [value] : [];

  return rawSorts.filter(
    (sort, index): sort is TSort =>
      allowedSorts.has(sort as TSort) && rawSorts.indexOf(sort) === index,
  );
}

export function parseAdminListBaseFilters<TSort extends string>(
  params: SearchParamsInput,
  allowedSorts: ReadonlySet<TSort>,
): AdminListSearchFilters<TSort> {
  return {
    keyword: getSearchParam(params, "keyword")?.trim() ?? "",
    status: parseAdminListStatus(getSearchParam(params, "status")),
    profile: parseAdminListProfile(getSearchParam(params, "profile")),
    fromDate: getSearchParam(params, "fromDate") ?? "",
    toDate: getSearchParam(params, "toDate") ?? "",
    sorts: parseAdminListSorts(params, allowedSorts),
    page: parsePositiveInteger(getSearchParam(params, "page"), 1),
    limit: parsePositiveInteger(getSearchParam(params, "limit"), 20, 100),
  };
}

/**
 * 회원/기사 목록 공통 필터를 URLSearchParams로 변환합니다.
 * 목록별 전용 필터(authProvider 등)는 반환받은 params에 추가하면 됩니다.
 */
export function createAdminListSearchParams<TSort extends string>(
  filters: AdminListSearchFilters<TSort>,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.keyword) {
    params.set("keyword", filters.keyword);
  }
  if (filters.status !== "ALL") {
    params.set("status", filters.status);
  }
  if (filters.profile !== "ALL") {
    params.set("profile", filters.profile);
  }
  if (filters.fromDate) {
    params.set("fromDate", filters.fromDate);
  }
  if (filters.toDate) {
    params.set("toDate", filters.toDate);
  }

  filters.sorts.forEach((sort) => {
    params.append("sorts", sort);
  });

  if (filters.page !== 1) {
    params.set("page", String(filters.page));
  }
  if (filters.limit !== 20) {
    params.set("limit", String(filters.limit));
  }

  return params;
}
