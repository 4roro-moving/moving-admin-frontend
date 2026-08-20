import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type {
  AdminNotice,
  AdminNoticeListQuery,
  AdminNoticeListResult,
  CreateAdminNoticePayload,
  UpdateAdminNoticePayload,
} from "@/types/adminNotice";

export const ADMIN_NOTICE_LIST_PAGE_LIMIT = 10;

export async function fetchAdminNotices(
  query: AdminNoticeListQuery = {},
): Promise<AdminNoticeListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_NOTICE_LIST_PAGE_LIMIT;

  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (query.keyword?.trim()) {
    search.set("keyword", query.keyword.trim());
  }

  if (query.audience) {
    search.set("audience", query.audience);
  }

  if (query.isVisible !== undefined) {
    search.set("isVisible", String(query.isVisible));
  }

  const result = await fetchInstance.getPaginated<AdminNotice[]>(
    `${API_ROUTES.ADMIN.NOTICES.ROOT}?${search.toString()}`,
  );

  return {
    items: result.data,
    pagination: result.pagination,
  };
}

export async function fetchAdminNotice(noticeId: number): Promise<AdminNotice> {
  const result = await fetchInstance.get<ApiResponse<AdminNotice>>(
    API_ROUTES.ADMIN.NOTICES.DETAIL(noticeId),
  );

  return result.data;
}

export async function createAdminNotice(
  payload: CreateAdminNoticePayload,
): Promise<AdminNotice> {
  const result = await fetchInstance.post<ApiResponse<AdminNotice>>(
    API_ROUTES.ADMIN.NOTICES.ROOT,
    payload,
  );

  return result.data;
}

export async function updateAdminNotice(
  noticeId: number,
  payload: UpdateAdminNoticePayload,
): Promise<AdminNotice> {
  const result = await fetchInstance.patch<ApiResponse<AdminNotice>>(
    API_ROUTES.ADMIN.NOTICES.DETAIL(noticeId),
    payload,
  );

  return result.data;
}

export async function deleteAdminNotice(noticeId: number): Promise<number> {
  const result = await fetchInstance.delete<ApiResponse<{ id: number }>>(
    API_ROUTES.ADMIN.NOTICES.DETAIL(noticeId),
  );

  return result.data.id;
}
