import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type {
  AdminInquiryDetail,
  AdminInquiryListItem,
  AdminInquiryListQuery,
  AdminInquiryListResult,
  AnswerAdminInquiryPayload,
} from "@/types/adminInquiry";

export const ADMIN_INQUIRY_LIST_PAGE_LIMIT = 10;

export async function fetchAdminInquiries(
  query: AdminInquiryListQuery = {},
): Promise<AdminInquiryListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_INQUIRY_LIST_PAGE_LIMIT;

  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (query.keyword?.trim()) {
    search.set("keyword", query.keyword.trim());
  }

  if (query.status !== undefined) {
    search.set("status", query.status);
  }

  if (query.openOnly !== undefined) {
    search.set("openOnly", String(query.openOnly));
  }

  const result = await fetchInstance.getPaginated<AdminInquiryListItem[]>(
    `${API_ROUTES.ADMIN.INQUIRIES.ROOT}?${search.toString()}`,
  );

  return {
    items: result.data,
    pagination: result.pagination,
  };
}

export async function fetchAdminInquiry(
  inquiryId: number,
): Promise<AdminInquiryDetail> {
  const result = await fetchInstance.get<ApiResponse<AdminInquiryDetail>>(
    API_ROUTES.ADMIN.INQUIRIES.DETAIL(inquiryId),
  );

  return result.data;
}

export async function answerAdminInquiry(
  inquiryId: number,
  payload: AnswerAdminInquiryPayload,
): Promise<AdminInquiryDetail> {
  const result = await fetchInstance.post<ApiResponse<AdminInquiryDetail>>(
    API_ROUTES.ADMIN.INQUIRIES.ANSWER(inquiryId),
    payload,
  );

  return result.data;
}

export async function closeAdminInquiry(
  inquiryId: number,
): Promise<AdminInquiryDetail> {
  const result = await fetchInstance.patch<ApiResponse<AdminInquiryDetail>>(
    API_ROUTES.ADMIN.INQUIRIES.CLOSE(inquiryId),
  );

  return result.data;
}
