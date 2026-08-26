import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type {
  AdminTerms,
  AdminTermsListItem,
  AdminTermsListQuery,
  AdminTermsListResult,
  CreateAdminTermsPayload,
  UpdateAdminTermsPayload,
} from "@/types/adminTerms";

export const ADMIN_TERMS_LIST_PAGE_LIMIT = 10;

export async function fetchAdminTermsList(
  query: AdminTermsListQuery = {},
): Promise<AdminTermsListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_TERMS_LIST_PAGE_LIMIT;

  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (query.keyword?.trim()) {
    search.set("keyword", query.keyword.trim());
  }

  if (query.type) {
    search.set("type", query.type);
  }

  if (query.status) {
    search.set("status", query.status);
  }

  const result = await fetchInstance.getPaginated<AdminTermsListItem[]>(
    `${API_ROUTES.ADMIN.TERMS.ROOT}?${search.toString()}`,
  );

  return {
    items: result.data,
    pagination: result.pagination,
  };
}

export async function fetchAdminTerms(termsId: number): Promise<AdminTerms> {
  const result = await fetchInstance.get<ApiResponse<AdminTerms>>(
    API_ROUTES.ADMIN.TERMS.DETAIL(termsId),
  );

  return result.data;
}

export async function createAdminTerms(
  payload: CreateAdminTermsPayload,
): Promise<AdminTerms> {
  const result = await fetchInstance.post<ApiResponse<AdminTerms>>(
    API_ROUTES.ADMIN.TERMS.ROOT,
    payload,
  );

  return result.data;
}

export async function updateAdminTerms(
  termsId: number,
  payload: UpdateAdminTermsPayload,
): Promise<AdminTerms> {
  const result = await fetchInstance.patch<ApiResponse<AdminTerms>>(
    API_ROUTES.ADMIN.TERMS.DETAIL(termsId),
    payload,
  );

  return result.data;
}

/**
 * 초안을 게시합니다.
 *
 * 서버는 같은 유형의 기존 게시본을 ARCHIVED 로 내리고 이 버전을 PUBLISHED 로 올립니다.
 * 즉 게시는 "교체"이며 되돌릴 수 없습니다. 호출 전 사용자 확인을 받아야 합니다.
 */
export async function publishAdminTerms(termsId: number): Promise<AdminTerms> {
  const result = await fetchInstance.patch<ApiResponse<AdminTerms>>(
    API_ROUTES.ADMIN.TERMS.PUBLISH(termsId),
  );

  return result.data;
}

export async function deleteAdminTerms(termsId: number): Promise<number> {
  const result = await fetchInstance.delete<ApiResponse<{ id: number }>>(
    API_ROUTES.ADMIN.TERMS.DETAIL(termsId),
  );

  return result.data.id;
}
