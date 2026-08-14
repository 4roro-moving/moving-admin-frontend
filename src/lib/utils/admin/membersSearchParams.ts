import type {
  AdminMemberAuthProviderFilter,
  AdminMemberStatus,
} from "@/types/adminMember";
import type { AdminProfileFilterValue } from "@/types/adminUser";
import {
  buildQueryString,
  getSearchParam,
  parsePositiveInteger,
  type SearchParamsInput,
} from "@/lib/utils/urlSearchParams";

export type MemberProfileFilter = AdminProfileFilterValue;
export type MemberAuthProvider = AdminMemberAuthProviderFilter;

export interface MemberListFilters {
  keyword: string; status: "ALL" | AdminMemberStatus; profile: MemberProfileFilter;
  authProvider: MemberAuthProvider; fromDate: string; toDate: string;
  sort: "LATEST" | "OLDEST" | "PENDING_DESC" | "PENDING_ASC"; page: number; limit: number;
}

export const MEMBER_LIST_DEFAULTS: MemberListFilters = {
  keyword: "", status: "ALL", profile: "ALL", authProvider: "ALL", fromDate: "", toDate: "", sort: "LATEST", page: 1, limit: 20,
};

export function parseMemberListFilters(params: SearchParamsInput): MemberListFilters {
  const status = getSearchParam(params, "status"), profile = getSearchParam(params, "profile"), authProvider = getSearchParam(params, "authProvider"), sort = getSearchParam(params, "sort");
  return {
    keyword: getSearchParam(params, "keyword")?.trim() ?? "",
    status: status === "ACTIVE" || status === "SUSPENDED" || status === "WITHDRAWN" ? status : "ALL",
    profile: profile === "COMPLETED" || profile === "INCOMPLETE" ? profile : "ALL",
    authProvider: authProvider === "LOCAL" || authProvider === "GOOGLE" || authProvider === "NAVER" || authProvider === "KAKAO" ? authProvider : "ALL",
    fromDate: getSearchParam(params, "fromDate") ?? "", toDate: getSearchParam(params, "toDate") ?? "",
    sort: sort === "OLDEST" || sort === "PENDING_DESC" || sort === "PENDING_ASC" ? sort : "LATEST", page: parsePositiveInteger(getSearchParam(params, "page"), 1), limit: parsePositiveInteger(getSearchParam(params, "limit"), 20, 100),
  };
}
export function buildMemberListQueryString(filters: MemberListFilters) {
  return buildQueryString(filters, MEMBER_LIST_DEFAULTS);
}
