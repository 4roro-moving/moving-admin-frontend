import type { Pagination } from "@/types/pagination";

export type AdminResidenceReviewSort =
  | "LATEST"
  | "OLDEST"
  | "RATING_HIGH"
  | "RATING_LOW"
  | "REPORT_HIGH";

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
