import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type {
  AdminMemberListItem,
  AdminMemberListQuery,
  AdminMemberListResult,
} from "@/types/adminMember";

export const ADMIN_MEMBER_LIST_DEFAULT_LIMIT = 20;

export async function fetchAdminMembers(
  query: AdminMemberListQuery = {},
): Promise<AdminMemberListResult> {
  const search = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? ADMIN_MEMBER_LIST_DEFAULT_LIMIT),
  });

  if (query.keyword) search.set("keyword", query.keyword);
  if (query.status) search.set("status", query.status);
  if (query.authProvider) search.set("authProvider", query.authProvider);
  if (query.isProfileCompleted !== undefined)
    search.set("isProfileCompleted", String(query.isProfileCompleted));
  if (query.fromDate) search.set("fromDate", query.fromDate);
  if (query.toDate) search.set("toDate", query.toDate);
  query.sorts?.forEach((sort) => search.append("sorts", sort));

  const result = await fetchInstance.getPaginated<AdminMemberListItem[]>(
    `${API_ROUTES.ADMIN.USERS.ROOT}?${search.toString()}`,
  );

  return { items: result.data, pagination: result.pagination };
}
