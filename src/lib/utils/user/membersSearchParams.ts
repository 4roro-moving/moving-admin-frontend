import type {
  AdminMemberListSort,
  AdminMemberAuthProviderFilter,
  AdminMemberStatus,
} from "@/types/adminMember";
import type { AdminProfileFilterValue } from "@/types/adminUser";
import {
  getSearchParam,
  parsePositiveInteger,
  type SearchParamsInput,
} from "@/lib/utils/urlSearchParams";

export type MemberProfileFilter = AdminProfileFilterValue;
export type MemberAuthProvider = AdminMemberAuthProviderFilter;

export interface MemberListFilters {
  keyword: string; status: "ALL" | AdminMemberStatus; profile: MemberProfileFilter;
  authProvider: MemberAuthProvider; fromDate: string; toDate: string;
  sorts: AdminMemberListSort[]; page: number; limit: number;
}

export const MEMBER_LIST_DEFAULTS: MemberListFilters = {
  keyword: "", status: "ALL", profile: "ALL", authProvider: "ALL", fromDate: "", toDate: "", sorts: [], page: 1, limit: 20,
};

const MEMBER_LIST_SORTS = new Set<AdminMemberListSort>([
  "PENDING_DESC",
  "PENDING_ASC",
  "CREATED_AT_DESC",
  "CREATED_AT_ASC",
]);

function getSorts(params: SearchParamsInput): AdminMemberListSort[] {
  const values = params.sorts;
  const rawSorts = Array.isArray(values) ? values : values ? [values] : [];

  return rawSorts.filter(
    (sort, index): sort is AdminMemberListSort =>
      MEMBER_LIST_SORTS.has(sort as AdminMemberListSort) &&
      rawSorts.indexOf(sort) === index,
  );
}

export function parseMemberListFilters(params: SearchParamsInput): MemberListFilters {
  const status = getSearchParam(params, "status"), profile = getSearchParam(params, "profile"), authProvider = getSearchParam(params, "authProvider");
  return {
    keyword: getSearchParam(params, "keyword")?.trim() ?? "",
    status: status === "ACTIVE" || status === "SUSPENDED" || status === "WITHDRAWN" ? status : "ALL",
    profile: profile === "COMPLETED" || profile === "INCOMPLETE" ? profile : "ALL",
    authProvider: authProvider === "LOCAL" || authProvider === "GOOGLE" || authProvider === "NAVER" || authProvider === "KAKAO" ? authProvider : "ALL",
    fromDate: getSearchParam(params, "fromDate") ?? "", toDate: getSearchParam(params, "toDate") ?? "",
    sorts: getSorts(params), page: parsePositiveInteger(getSearchParam(params, "page"), 1), limit: parsePositiveInteger(getSearchParam(params, "limit"), 20, 100),
  };
}
export function buildMemberListQueryString(filters: MemberListFilters) {
  const params = new URLSearchParams();
  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.status !== "ALL") params.set("status", filters.status);
  if (filters.profile !== "ALL") params.set("profile", filters.profile);
  if (filters.authProvider !== "ALL") params.set("authProvider", filters.authProvider);
  if (filters.fromDate) params.set("fromDate", filters.fromDate);
  if (filters.toDate) params.set("toDate", filters.toDate);
  filters.sorts.forEach((sort) => params.append("sorts", sort));
  if (filters.page !== 1) params.set("page", String(filters.page));
  if (filters.limit !== 20) params.set("limit", String(filters.limit));
  return params.toString();
}
