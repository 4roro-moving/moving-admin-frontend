import type { AdminReviewSort } from "@/types/adminReview";

export const QUERY_KEYS = {
  AUTH: {
    ADMIN_SESSION: ["auth", "admin-session"] as const,
  },
  REPORTS: {
    ALL: ["admin", "reports"] as const,
  },
  MEMBERS: {
    ALL: ["admin", "members"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      status?: string;
      authProvider?: string;
      isProfileCompleted?: boolean;
      fromDate?: string;
      toDate?: string;
      sort?: string;
    }) => ["admin", "members", "list", params] as const,
  },
  MOVERS: {
    ALL: ["admin", "movers"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      status?: string;
      isProfileCompleted?: boolean;
      regionId?: number;
      moveType?: string;
      fromDate?: string;
      toDate?: string;
      sort?: string;
    }) => ["admin", "movers", "list", params] as const,
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
