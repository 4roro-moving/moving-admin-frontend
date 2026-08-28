import type { Pagination } from "@/types/pagination";

export type AdminResidenceReviewSort =
  | "LATEST"
  | "OLDEST"
  | "RATING_HIGH"
  | "RATING_LOW"
  | "REPORT_HIGH";

/** GET /api/admin/residence-reviews 쿼리. BE listAdminResidenceReviewsQuerySchema 와 맞춤 */
export interface AdminResidenceReviewListQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: AdminResidenceReviewSort;
  isHidden?: boolean;
}

export interface AdminResidenceReviewAuthor {
  id: string;
  name: string;
  email: string;
}

export interface AdminResidenceReviewRegion {
  id: number;
  name: string;
}

export interface AdminResidenceReviewLatestModeration {
  action: "HIDE" | "UNHIDE";
  reason: string | null;
  adminName: string;
  createdAt: string;
}

/** 목록·숨김/복구 응답 data 한 건. BE AdminResidenceReviewListItem 의 JSON 형태 */
export interface AdminResidenceReviewItem {
  id: number;
  contentType: "RESIDENCE_REVIEW";
  isHidden: boolean;
  rating: number;
  title: string;
  content: string;
  author: AdminResidenceReviewAuthor;
  region: AdminResidenceReviewRegion;
  reportCount: number;
  latestModeration: AdminResidenceReviewLatestModeration | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminResidenceReviewListResult {
  items: AdminResidenceReviewItem[];
  pagination: Pagination;
}

/** POST .../hide body. BE hideResidenceReviewBodySchema 와 동일 */
export interface AdminResidenceReviewHidePayload {
  reason: string;
}
