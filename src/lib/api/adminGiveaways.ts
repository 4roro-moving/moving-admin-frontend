import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ADMIN_GIVEAWAY_LIST_PAGE_LIMIT } from "@/lib/constants/adminGiveaways";
import type { ApiResponse } from "@/types/api";
import type {
  AdminGiveawayHidePayload,
  AdminGiveawayItem,
  AdminGiveawayListQuery,
  AdminGiveawayListResult,
} from "@/types/adminGiveaway";

const SORT_FALLBACK = "LATEST";

export async function fetchAdminGiveaways(
  query: AdminGiveawayListQuery = {},
): Promise<AdminGiveawayListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_GIVEAWAY_LIST_PAGE_LIMIT;
  const sort = query.sort ?? SORT_FALLBACK;
  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (query.keyword) {
    search.set("keyword", query.keyword);
  }

  if (query.isHidden !== undefined) {
    search.set("isHidden", String(query.isHidden));
  }

  const result = await fetchInstance.getPaginated<AdminGiveawayItem[]>(
    `${API_ROUTES.ADMIN.GIVEAWAYS.ROOT}?${search.toString()}`,
  );

  return {
    items: result.data,
    pagination: result.pagination,
  };
}

export async function hideAdminGiveaway(
  giveawayId: number,
  payload: AdminGiveawayHidePayload,
): Promise<AdminGiveawayItem> {
  const body = await fetchInstance.post<ApiResponse<AdminGiveawayItem>>(
    API_ROUTES.ADMIN.GIVEAWAYS.HIDE(giveawayId),
    payload,
  );

  return body.data;
}

export async function unhideAdminGiveaway(giveawayId: number): Promise<AdminGiveawayItem> {
  const body = await fetchInstance.post<ApiResponse<AdminGiveawayItem>>(
    API_ROUTES.ADMIN.GIVEAWAYS.UNHIDE(giveawayId),
    {},
  );

  return body.data;
}
