import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type {
  AdminFaq,
  AdminFaqListQuery,
  AdminFaqListResult,
  CreateAdminFaqPayload,
  UpdateAdminFaqPayload,
} from "@/types/adminFaq";

export const ADMIN_FAQ_LIST_PAGE_LIMIT = 10;

export async function fetchAdminFaqs(
  query: AdminFaqListQuery = {},
): Promise<AdminFaqListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_FAQ_LIST_PAGE_LIMIT;

  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (query.keyword?.trim()) {
    search.set("keyword", query.keyword.trim());
  }

  if (query.isVisible !== undefined) {
    search.set("isVisible", String(query.isVisible));
  }

  const result = await fetchInstance.getPaginated<AdminFaq[]>(
    `${API_ROUTES.ADMIN.FAQS.ROOT}?${search.toString()}`,
  );

  return {
    items: result.data,
    pagination: result.pagination,
  };
}

export async function fetchAdminFaq(faqId: number): Promise<AdminFaq> {
  const result = await fetchInstance.get<ApiResponse<AdminFaq>>(
    API_ROUTES.ADMIN.FAQS.DETAIL(faqId),
  );

  return result.data;
}

export async function createAdminFaq(
  payload: CreateAdminFaqPayload,
): Promise<AdminFaq> {
  const result = await fetchInstance.post<ApiResponse<AdminFaq>>(
    API_ROUTES.ADMIN.FAQS.ROOT,
    payload,
  );

  return result.data;
}

export async function updateAdminFaq(
  faqId: number,
  payload: UpdateAdminFaqPayload,
): Promise<AdminFaq> {
  const result = await fetchInstance.patch<ApiResponse<AdminFaq>>(
    API_ROUTES.ADMIN.FAQS.DETAIL(faqId),
    payload,
  );

  return result.data;
}

export async function deleteAdminFaq(faqId: number): Promise<number> {
  const result = await fetchInstance.delete<ApiResponse<{ id: number }>>(
    API_ROUTES.ADMIN.FAQS.DETAIL(faqId),
  );

  return result.data.id;
}
