import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type {
  AdminCustomerListItem,
  AdminCustomerListQuery,
  AdminCustomerListResult,
} from "@/types/adminCustomer";
import type {
  AdminCustomerDetail,
  AdminCustomerStatusUpdatePayload,
  AdminCustomerStatusUpdateResult,
} from "@/types/adminCustomerDetail";

export const ADMIN_CUSTOMER_LIST_DEFAULT_LIMIT = 20;

export async function fetchAdminCustomers(
  query: AdminCustomerListQuery = {},
): Promise<AdminCustomerListResult> {
  const search = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? ADMIN_CUSTOMER_LIST_DEFAULT_LIMIT),
  });

  if (query.keyword) search.set("keyword", query.keyword);
  if (query.status) search.set("status", query.status);
  if (query.authProvider) search.set("authProvider", query.authProvider);
  if (query.isProfileCompleted !== undefined)
    search.set("isProfileCompleted", String(query.isProfileCompleted));
  if (query.fromDate) search.set("fromDate", query.fromDate);
  if (query.toDate) search.set("toDate", query.toDate);
  query.sorts?.forEach((sort) => search.append("sorts", sort));

  const result = await fetchInstance.getPaginated<AdminCustomerListItem[]>(
    `${API_ROUTES.ADMIN.USERS.ROOT}?${search.toString()}`,
  );

  return { items: result.data, pagination: result.pagination };
}

export async function fetchAdminCustomerDetail(
  customerId: string,
): Promise<AdminCustomerDetail> {
  const result = await fetchInstance.get<ApiResponse<AdminCustomerDetail>>(
    API_ROUTES.ADMIN.USERS.DETAIL(customerId),
  );

  return result.data;
}

export async function updateAdminCustomerStatus(
  customerId: string,
  payload: AdminCustomerStatusUpdatePayload,
): Promise<AdminCustomerStatusUpdateResult> {
  const result = await fetchInstance.patch<ApiResponse<AdminCustomerStatusUpdateResult>>(
    API_ROUTES.ADMIN.USERS.STATUS(customerId),
    payload,
  );

  return result.data;
}
