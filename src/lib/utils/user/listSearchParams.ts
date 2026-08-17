import type {
  AdminAccountStatus,
  AdminProfileFilterValue,
} from "@/types/adminUser";
import {
  getSearchParam,
  parsePositiveInteger,
  type SearchParamsInput,
} from "@/lib/utils/urlSearchParams";

export interface AdminListSearchFilters<TSort extends string> {
  keyword: string;
  status: "ALL" | AdminAccountStatus;
  profile: AdminProfileFilterValue;
  fromDate: string;
  toDate: string;
  sorts: TSort[];
  page: number;
  limit: number;
}

function parseStatus(value: string | undefined): "ALL" | AdminAccountStatus {
  return value === "ACTIVE" || value === "SUSPENDED" || value === "WITHDRAWN"
    ? value
    : "ALL";
}

function parseProfile(value: string | undefined): AdminProfileFilterValue {
  return value === "COMPLETED" || value === "INCOMPLETE" ? value : "ALL";
}

/** 반복 sorts 파라미터에서 허용된 값만 남기고 중복을 제거합니다. */
export function parseListSorts<TSort extends string>(
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

export function parseAdminListSearchFilters<TSort extends string>(
  params: SearchParamsInput,
  allowedSorts: ReadonlySet<TSort>,
): AdminListSearchFilters<TSort> {
  return {
    keyword: getSearchParam(params, "keyword")?.trim() ?? "",
    status: parseStatus(getSearchParam(params, "status")),
    profile: parseProfile(getSearchParam(params, "profile")),
    fromDate: getSearchParam(params, "fromDate") ?? "",
    toDate: getSearchParam(params, "toDate") ?? "",
    sorts: parseListSorts(params, allowedSorts),
    page: parsePositiveInteger(getSearchParam(params, "page"), 1),
    limit: parsePositiveInteger(getSearchParam(params, "limit"), 20, 100),
  };
}

/** 회원·기사 목록 공통 URL 쿼리를 생성합니다. */
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
  filters.sorts.forEach((sort) => params.append("sorts", sort));
  if (filters.page !== 1) {
    params.set("page", String(filters.page));
  }
  if (filters.limit !== 20) {
    params.set("limit", String(filters.limit));
  }

  return params;
}
