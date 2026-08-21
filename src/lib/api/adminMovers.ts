import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type {
  AdminMoverListItem,
  AdminMoverListQuery,
  AdminMoverListResult,
} from "@/types/adminMover";
import type { AdminMoverDetail } from "@/types/adminMoverDetail";

export const ADMIN_MOVER_LIST_DEFAULT_LIMIT = 20;

export async function fetchAdminMovers(
  query: AdminMoverListQuery = {},
): Promise<AdminMoverListResult> {
  const search = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? ADMIN_MOVER_LIST_DEFAULT_LIMIT),
  });

  if (query.keyword) search.set("keyword", query.keyword);
  if (query.status) search.set("status", query.status);
  if (query.isProfileCompleted !== undefined)
    search.set("isProfileCompleted", String(query.isProfileCompleted));
  if (query.regionId) search.set("regionId", String(query.regionId));
  if (query.moveType) search.set("moveType", query.moveType);
  if (query.fromDate) search.set("fromDate", query.fromDate);
  if (query.toDate) search.set("toDate", query.toDate);
  query.sorts?.forEach((sort) => search.append("sorts", sort));

  const result = await fetchInstance.getPaginated<AdminMoverListItem[]>(
    `${API_ROUTES.ADMIN.MOVERS.ROOT}?${search.toString()}`,
  );

  return { items: result.data, pagination: result.pagination };
}

export async function fetchAdminMoverDetail(
  moverId: string,
): Promise<AdminMoverDetail> {
  const result = await fetchInstance.get<ApiResponse<AdminMoverDetail>>(
    API_ROUTES.ADMIN.MOVERS.DETAIL(moverId),
  );

  return result.data;
}
