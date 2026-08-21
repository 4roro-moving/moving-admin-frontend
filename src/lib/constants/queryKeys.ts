import type {
  AdminReportReason,
  AdminReportSort,
  AdminReportStatus,
  AdminReportTargetType,
} from "@/types/adminReport";
import type { AdminReviewSort } from "@/types/adminReview";

export const QUERY_KEYS = {
  AUTH: {
    ADMIN_SESSION: ["auth", "admin-session"] as const,
  },
  DASHBOARD: {
    SUMMARY: ["admin", "dashboard", "summary"] as const,
  },
  REPORTS: {
    ALL: ["admin", "reports"] as const,
    SUMMARY: ["admin", "reports", "summary"] as const,
    DETAIL_PLACEHOLDER: ["admin", "reports", "detail"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      status: AdminReportStatus | "ALL";
      targetType: AdminReportTargetType | "ALL";
      reason: AdminReportReason | "ALL";
      sort: AdminReportSort;
    }) => ["admin", "reports", "list", params] as const,
    DETAIL: (reportId: number) => ["admin", "reports", "detail", reportId] as const,
  },
  CUSTOMERS: {
    ALL: ["admin", "customers"] as const,
    DETAIL_PLACEHOLDER: ["admin", "customers", "detail"] as const,
    DETAIL: (customerId: string) => ["admin", "customers", "detail", customerId] as const,
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
    }) => ["admin", "customers", "list", params] as const,
  },
  MOVERS: {
    ALL: ["admin", "movers"] as const,
    DETAIL_PLACEHOLDER: ["admin", "movers", "detail"] as const,
    DETAIL: (moverId: string) => ["admin", "movers", "detail", moverId] as const,
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
