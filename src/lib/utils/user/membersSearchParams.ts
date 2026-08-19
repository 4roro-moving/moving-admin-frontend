import type { AdminListApiSort } from "@/types/adminUser";
import type { AdminMemberAuthProviderFilter } from "@/types/adminMember";
import {
  createAdminListSearchParams,
  parseAdminListSearchFilters,
  type AdminListSearchFilters,
} from "./listSearchParams";
import {
  getSearchParam,
  type SearchParamsInput,
} from "@/lib/utils/urlSearchParams";

export interface MemberListFilters
  extends AdminListSearchFilters<AdminListApiSort> {
  authProvider: AdminMemberAuthProviderFilter;
}

export const MEMBER_LIST_DEFAULTS: MemberListFilters = {
  keyword: "",
  status: "ALL",
  profile: "ALL",
  authProvider: "ALL",
  fromDate: "",
  toDate: "",
  sorts: [],
  page: 1,
  limit: 20,
};

const MEMBER_LIST_SORTS = new Set<AdminListApiSort>([
  "PENDING_DESC",
  "PENDING_ASC",
  "CREATED_AT_DESC",
  "CREATED_AT_ASC",
]);

export function parseMemberListFilters(
  params: SearchParamsInput,
): MemberListFilters {
  const authProvider = getSearchParam(params, "authProvider");

  return {
    ...parseAdminListSearchFilters(params, MEMBER_LIST_SORTS),
    authProvider:
      authProvider === "LOCAL" ||
      authProvider === "GOOGLE" ||
      authProvider === "NAVER" ||
      authProvider === "KAKAO"
        ? authProvider
        : "ALL",
  };
}
export function buildMemberListQueryString(filters: MemberListFilters) {
  const params = createAdminListSearchParams(filters);

  if (filters.authProvider !== "ALL")
    params.set("authProvider", filters.authProvider);

  return params.toString();
}
