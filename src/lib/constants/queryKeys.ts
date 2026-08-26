import type {
  AdminReportReason,
  AdminReportSort,
  AdminReportStatus,
  AdminReportTargetType,
} from "@/types/adminReport";
import type { AdminDashboardPeriod } from "@/types/adminDashboard";
import type { AdminGiveawaySort } from "@/types/adminGiveaway";
import type { AdminInquiryStatus } from "@/types/adminInquiry";
import type { AdminResidenceReviewSort } from "@/types/adminResidenceReview";
import type { AdminTermsStatus, AdminTermsType } from "@/types/adminTerms";
import type { AdminReviewSort } from "@/types/adminReview";

export const QUERY_KEYS = {
  AUTH: {
    ADMIN_SESSION: ["auth", "admin-session"] as const,
  },
  DASHBOARD: {
    ALL: ["admin", "dashboard"] as const,
    // 기간이 바뀌면 다른 응답이므로 키에 포함한다.
    SUMMARY: (period: AdminDashboardPeriod) =>
      ["admin", "dashboard", "summary", period] as const,
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
    DETAIL: (reportId: number) =>
      ["admin", "reports", "detail", reportId] as const,
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
  RESIDENCE_REVIEWS: {
    ALL: ["admin", "residence-reviews"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      sort: AdminResidenceReviewSort;
      isHidden?: boolean;
    }) => ["admin", "residence-reviews", "list", params] as const,
  },
  GIVEAWAYS: {
    ALL: ["admin", "giveaways"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      sort: AdminGiveawaySort;
      isHidden?: boolean;
    }) => ["admin", "giveaways", "list", params] as const,
  },
  FAQS: {
    ALL: ["admin", "faqs"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      isVisible?: boolean;
    }) => ["admin", "faqs", "list", params] as const,
    DETAIL: (faqId: number) => ["admin", "faqs", "detail", faqId] as const,
  },
  INQUIRIES: {
    ALL: ["admin", "inquiries"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      status?: AdminInquiryStatus;
      openOnly?: boolean;
    }) => ["admin", "inquiries", "list", params] as const,
    DETAIL: (inquiryId: number) =>
      ["admin", "inquiries", "detail", inquiryId] as const,
  },
  NOTICES: {
    ALL: ["admin", "notices"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      audience?: string;
      isVisible?: boolean;
    }) => ["admin", "notices", "list", params] as const,
    DETAIL: (noticeId: number) =>
      ["admin", "notices", "detail", noticeId] as const,
  },
  TERMS: {
    ALL: ["admin", "terms"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      type?: AdminTermsType;
      status?: AdminTermsStatus;
    }) => ["admin", "terms", "list", params] as const,
    DETAIL: (termsId: number) => ["admin", "terms", "detail", termsId] as const,
  },
} as const;
