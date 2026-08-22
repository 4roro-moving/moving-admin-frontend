import type { AdminResidenceReviewSort } from "@/types/adminResidenceReview";

export const ADMIN_RESIDENCE_REVIEW_SORT_OPTIONS: Array<{
  value: AdminResidenceReviewSort;
  label: string;
}> = [
  { value: "LATEST", label: "최신순" },
  { value: "OLDEST", label: "오래된순" },
  { value: "RATING_HIGH", label: "별점 높은순" },
  { value: "RATING_LOW", label: "별점 낮은순" },
  { value: "REPORT_HIGH", label: "신고 많은순" },
];

export const ADMIN_RESIDENCE_REVIEW_LIST_PAGE_LIMIT = 10;
