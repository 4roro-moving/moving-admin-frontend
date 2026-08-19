import type {
  AdminAccountStatus,
  AdminProfileFilterValue,
} from "@/types/adminUser";
import {
  getSearchParam,
  parsePositiveInteger,
  type SearchParamsInput,
} from "@/lib/utils/urlSearchParams";

/** 회원·기사 목록이 공유하는 URL 필터 상태입니다. */
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

/**
 * 허용된 값만 남기고, 같은 정렬 필드의 반대 방향을 포함한 중복을 제거합니다.
 * 배열 앞 항목이 API의 높은 정렬 우선순위를 가지며 같은 필드는 먼저 온 방향을 유지합니다.
 */
export function parseListSorts<TSort extends string>(
  params: SearchParamsInput,
  allowedSorts: ReadonlySet<TSort>,
): TSort[] {
  const value = params.sorts;
  const rawSorts = Array.isArray(value) ? value : value ? [value] : [];
  const usedSortFields = new Set<string>();

  return rawSorts.filter((sort): sort is TSort => {
    if (!allowedSorts.has(sort as TSort)) return false;

    const sortField = sort.replace(/_(ASC|DESC)$/, "");
    if (usedSortFields.has(sortField)) return false;

    usedSortFields.add(sortField);
    return true;
  });
}

/** 유효하지 않은 값은 기본값으로 보정합니다. */
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

/**
 * 회원·기사 목록 공통 필터를 URL 쿼리로 변환합니다.
 * 목록별 전용 필터(예: 기사의 경력)는 반환된 params에 이어서 추가합니다.
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
  filters.sorts.forEach((sort) => params.append("sorts", sort));
  if (filters.page !== 1) {
    params.set("page", String(filters.page));
  }
  if (filters.limit !== 20) {
    params.set("limit", String(filters.limit));
  }

  return params;
}
