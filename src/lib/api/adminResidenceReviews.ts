import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ADMIN_RESIDENCE_REVIEW_LIST_PAGE_LIMIT } from "@/lib/constants/adminResidenceReviews";
import type { ApiResponse } from "@/types/api";
import type {
  AdminResidenceReviewHidePayload,
  AdminResidenceReviewItem,
  AdminResidenceReviewListQuery,
  AdminResidenceReviewListResult,
} from "@/types/adminResidenceReview";

const SORT_FALLBACK = "LATEST";

export async function fetchAdminResidenceReviews(
  query: AdminResidenceReviewListQuery = {},
): Promise<AdminResidenceReviewListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_RESIDENCE_REVIEW_LIST_PAGE_LIMIT;
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

  const result = await fetchInstance.getPaginated<AdminResidenceReviewItem[]>(
    `${API_ROUTES.ADMIN.RESIDENCE_REVIEWS.ROOT}?${search.toString()}`,
  );

  return {
    items: result.data,
    pagination: result.pagination,
  };
}

export async function hideAdminResidenceReview(
  residenceReviewId: number,
  payload: AdminResidenceReviewHidePayload,
): Promise<AdminResidenceReviewItem> {
  const body = await fetchInstance.post<ApiResponse<AdminResidenceReviewItem>>(
    API_ROUTES.ADMIN.RESIDENCE_REVIEWS.HIDE(residenceReviewId),
    payload,
  );

  return body.data;
}

export async function unhideAdminResidenceReview(
  residenceReviewId: number,
): Promise<AdminResidenceReviewItem> {
  const body = await fetchInstance.post<ApiResponse<AdminResidenceReviewItem>>(
    API_ROUTES.ADMIN.RESIDENCE_REVIEWS.UNHIDE(residenceReviewId),
    {},
  );

  return body.data;
}
