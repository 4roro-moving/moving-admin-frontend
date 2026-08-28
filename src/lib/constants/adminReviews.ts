import type { AdminReviewSort } from "@/types/adminReview";

export const ADMIN_REVIEW_SORT_OPTIONS: Array<{ value: AdminReviewSort; label: string }> = [
  { value: "LATEST", label: "최신순" },
  { value: "OLDEST", label: "오래된순" },
  { value: "RATING_HIGH", label: "별점 높은순" },
  { value: "RATING_LOW", label: "별점 낮은순" },
  { value: "REPORT_HIGH", label: "신고 많은순" },
];

export const HIDE_REASON_MIN_LENGTH = 10;
export const HIDE_REASON_MAX_LENGTH = 500;
