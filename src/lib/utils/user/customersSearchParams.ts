import type { AdminListApiSort } from "@/types/adminUser";
import type { AdminCustomerAuthProviderFilter } from "@/types/adminCustomer";
import {
  createAdminListSearchParams,
  parseAdminListSearchFilters,
  type AdminListSearchFilters,
} from "./listSearchParams";
import {
  getSearchParam,
  type SearchParamsInput,
} from "@/lib/utils/urlSearchParams";

export interface CustomerListFilters
  extends AdminListSearchFilters<AdminListApiSort> {
  authProvider: AdminCustomerAuthProviderFilter;
}

export const CUSTOMER_LIST_DEFAULTS: CustomerListFilters = {
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

const CUSTOMER_LIST_SORTS = new Set<AdminListApiSort>([
  "PENDING_DESC",
  "PENDING_ASC",
  "OPEN_INQUIRY_DESC",
  "OPEN_INQUIRY_ASC",
  "CREATED_AT_DESC",
  "CREATED_AT_ASC",
]);

export function parseCustomerListFilters(
  params: SearchParamsInput,
): CustomerListFilters {
  const authProvider = getSearchParam(params, "authProvider");

  return {
    ...parseAdminListSearchFilters(params, CUSTOMER_LIST_SORTS),
    authProvider:
      authProvider === "LOCAL" ||
      authProvider === "GOOGLE" ||
      authProvider === "NAVER" ||
      authProvider === "KAKAO"
        ? authProvider
        : "ALL",
  };
}
export function buildCustomerListQueryString(filters: CustomerListFilters) {
  const params = createAdminListSearchParams(filters);

  if (filters.authProvider !== "ALL")
    params.set("authProvider", filters.authProvider);

  return params.toString();
}
