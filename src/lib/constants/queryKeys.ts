import type { AdminReviewSort } from "@/types/adminReview";

export const QUERY_KEYS = {
  AUTH: {
    ADMIN_SESSION: ["auth", "admin-session"] as const,
  },
  REPORTS: {
    ALL: ["admin", "reports"] as const,
  },
  REVIEWS: {
    ALL: ["admin", "reviews"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      sort: AdminReviewSort;
    }) => ["admin", "reviews", "list", params] as const,
  },
} as const;
