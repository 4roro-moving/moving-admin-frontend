import type { AdminInquiryCategory, AdminInquiryStatus } from "@/types/adminInquiry";
import type {
  AdminReportReason,
  AdminReportStatus,
  AdminReportTargetType,
} from "@/types/adminReport";

/* ─────────────────────────────────────────────────────────────
 * 서버 응답 (GET /api/admin/dashboard)
 *
 * 백엔드 `dashboard.type.ts` 의 DashboardSummary 와 1:1 대응합니다.
 * 서버는 숫자와 enum 만 내려주고, 화면 문구는 프론트에서 만듭니다.
 * ───────────────────────────────────────────────────────────── */

/** 집계 기간. 기간 한정 지표(서비스 운영 현황·신규 가입)에만 적용됩니다. */
export type AdminDashboardPeriod = "7d" | "30d" | "90d";

export const ADMIN_DASHBOARD_PERIODS: readonly AdminDashboardPeriod[] = [
  "7d",
  "30d",
  "90d",
] as const;

export const ADMIN_DASHBOARD_PERIOD_LABELS: Record<AdminDashboardPeriod, string> = {
  "7d": "최근 7일",
  "30d": "최근 30일",
  "90d": "최근 90일",
};

export const DEFAULT_ADMIN_DASHBOARD_PERIOD: AdminDashboardPeriod = "7d";

export interface AdminDashboardMemberSummary {
  totalCount: number;
  activeMoverCount: number;
  newInPeriod: number;
}

export interface AdminDashboardPendingSummary {
  pendingReportCount: number;
  openInquiryCount: number;
}

export interface AdminDashboardServiceSummary {
  requestedCount: number;
  submittedCount: number;
  confirmedCount: number;
  completedCount: number;
}

export interface AdminDashboardContentSummary {
  hiddenReviewCount: number;
  hiddenResidenceReviewCount: number;
  hiddenGiveawayCount: number;
  hiddenNoticeCount: number;
  hiddenFaqCount: number;
}

export interface AdminDashboardRecentReport {
  id: number;
  targetType: AdminReportTargetType;
  reason: AdminReportReason;
  status: AdminReportStatus;
  createdAt: string;
}

export interface AdminDashboardRecentInquiry {
  id: number;
  category: AdminInquiryCategory;
  title: string;
  status: AdminInquiryStatus;
  createdAt: string;
}

export interface AdminDashboardRecentActivity {
  id: number;
  action: string;
  targetType: string;
  memo: string | null;
  createdAt: string;
  actor: { name: string } | null;
}

/** `GET /api/admin/dashboard` 의 `data` 필드. */
export interface AdminDashboardSummaryResponse {
  period: AdminDashboardPeriod;
  since: string;
  members: AdminDashboardMemberSummary;
  pending: AdminDashboardPendingSummary;
  service: AdminDashboardServiceSummary;
  contents: AdminDashboardContentSummary;
  recent: {
    reports: AdminDashboardRecentReport[];
    inquiries: AdminDashboardRecentInquiry[];
    activities: AdminDashboardRecentActivity[];
  };
}

/* ─────────────────────────────────────────────────────────────
 * 화면 모델
 *
 * 서버 응답을 `lib/utils/adminDashboard.ts` 에서 이 형태로 변환합니다.
 * 컴포넌트는 이 타입만 알면 되고, 서버 응답 구조를 몰라도 됩니다.
 * ───────────────────────────────────────────────────────────── */

export interface AdminDashboardMetric {
  label: string;
  value: string;
  helper: string;
  tone?: "default" | "accent";
}

export interface AdminDashboardRecentItem {
  id: string;
  status: string;
  statusTone: "pending" | "resolved";
  primary: string;
  meta: string;
}

export interface AdminDashboardServiceStage {
  label: string;
  value: string;
  highlighted?: boolean;
  valueSize?: "default" | "large";
}

export interface AdminDashboardContentSummaryItem {
  label: string;
  value: string;
  tone?: "default" | "accent";
}

export interface AdminDashboardActivityItem {
  action: string;
  memo: string;
  timeAgo: string;
}

export interface AdminDashboardData {
  pageTitle: string;
  pageDescription: string;
  /** 서버가 되돌려준 기간. 화면이 "최근 N일 기준"을 표시할 때 씁니다. */
  period: AdminDashboardPeriod;
  metrics: AdminDashboardMetric[];
  recentReports: {
    title: string;
    description: string;
    actionLabel: string;
    items: AdminDashboardRecentItem[];
  };
  recentInquiries: {
    title: string;
    description: string;
    actionLabel: string;
    items: AdminDashboardRecentItem[];
  };
  serviceOverview: {
    title: string;
    description: string;
    stages: AdminDashboardServiceStage[];
  };
  contentSummary: {
    title: string;
    description: string;
    items: AdminDashboardContentSummaryItem[];
  };
  recentActivities: {
    title: string;
    description: string;
    items: AdminDashboardActivityItem[];
  };
}
