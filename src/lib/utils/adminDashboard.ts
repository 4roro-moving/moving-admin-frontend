import {
  ADMIN_REPORT_REASON_LABELS,
  ADMIN_REPORT_STATUS_LABELS,
  ADMIN_REPORT_TARGET_LABELS,
} from "@/lib/constants/adminReports";
import {
  getAdminInquiryCategoryLabel,
  getAdminInquiryStatusLabel,
} from "@/lib/utils/adminInquiry";
import {
  ADMIN_DASHBOARD_PERIOD_LABELS,
  type AdminDashboardData,
  type AdminDashboardRecentItem,
  type AdminDashboardSummaryResponse,
} from "@/types/adminDashboard";

/**
 * 서버 대시보드 응답을 화면 모델로 변환합니다.
 *
 * 서버는 숫자와 enum 만 내려주므로 "1,284명" 같은 표시 문구는 여기서 만듭니다.
 * 포매팅을 컴포넌트에 두면 mock 과 실제 응답의 렌더 결과가 갈라지므로 한 곳에 모읍니다.
 */

const numberFormatter = new Intl.NumberFormat("ko-KR");

function formatCount(value: number, unit: string): string {
  return `${numberFormatter.format(value)}${unit}`;
}

/** 목록 항목의 시각. 연도는 생략하고 "08.15 14:32" 형태로 보여줍니다. */
function formatRecentTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return `${getPart("month")}.${getPart("day")} ${getPart("hour")}:${getPart("minute")}`;
}

/**
 * 관리자 활동 로그의 상대 시각.
 *
 * 서버가 UTC ISO 문자열을 주므로 클라이언트 시각과 비교합니다.
 * 시계 오차로 음수가 나오면 "방금 전"으로 처리합니다.
 */
function formatTimeAgo(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return "방금 전";
  }

  if (diffMinutes < 60) {
    return `${String(diffMinutes)}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${String(diffHours)}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${String(diffDays)}일 전`;
  }

  return formatRecentTimestamp(value);
}

function toReportItem(
  report: AdminDashboardSummaryResponse["recent"]["reports"][number],
): AdminDashboardRecentItem {
  return {
    id: `report-${String(report.id)}`,
    status: ADMIN_REPORT_STATUS_LABELS[report.status],
    // PENDING 만 "처리 필요"로 강조하고, RESOLVED/REJECTED 는 처리 완료로 묶습니다.
    statusTone: report.status === "PENDING" ? "pending" : "resolved",
    primary: `${ADMIN_REPORT_TARGET_LABELS[report.targetType]} · ${ADMIN_REPORT_REASON_LABELS[report.reason]}`,
    meta: formatRecentTimestamp(report.createdAt),
  };
}

function toInquiryItem(
  inquiry: AdminDashboardSummaryResponse["recent"]["inquiries"][number],
): AdminDashboardRecentItem {
  return {
    id: `inquiry-${String(inquiry.id)}`,
    status: getAdminInquiryStatusLabel(inquiry.status),
    statusTone: inquiry.status === "OPEN" ? "pending" : "resolved",
    primary: inquiry.title,
    meta: `${getAdminInquiryCategoryLabel(inquiry.category)} · ${formatRecentTimestamp(inquiry.createdAt)}`,
  };
}

export function mapAdminDashboardResponse(
  response: AdminDashboardSummaryResponse,
): AdminDashboardData {
  const periodLabel = ADMIN_DASHBOARD_PERIOD_LABELS[response.period];

  const { members, pending, service, contents, recent } = response;

  return {
    pageTitle: "대시보드",
    pageDescription: "MOVING 서비스와 주요 운영 현황을 한눈에 확인합니다.",
    period: response.period,

    metrics: [
      {
        label: "전체 회원",
        value: formatCount(members.totalCount, "명"),
        helper: `누적 · ${periodLabel} 신규 ${formatCount(members.newInPeriod, "명")}`,
      },
      {
        label: "활성 기사",
        value: formatCount(members.activeMoverCount, "명"),
        helper: "누적 · 활동 중 기사",
      },
      {
        label: "처리 대기 신고",
        value: formatCount(pending.pendingReportCount, "건"),
        helper: "아직 처리되지 않음",
        tone: pending.pendingReportCount > 0 ? "accent" : "default",
      },
      {
        label: "답변 대기 문의",
        value: formatCount(pending.openInquiryCount, "건"),
        helper: "아직 답변되지 않음",
        tone: pending.openInquiryCount > 0 ? "accent" : "default",
      },
    ],

    recentReports: {
      title: "최근 신고",
      description: "접수된 신고와 처리 상태를 확인합니다.",
      actionLabel: "신고 관리 →",
      items: recent.reports.map(toReportItem),
    },

    recentInquiries: {
      title: "최근 문의",
      description: "고객과 기사님의 Q&A 문의 현황입니다.",
      actionLabel: "Q&A 관리 →",
      items: recent.inquiries.map(toInquiryItem),
    },

    serviceOverview: {
      title: "서비스 운영 현황",
      description: `${periodLabel} 기준, 견적 요청부터 이사 완료까지의 흐름입니다.`,
      stages: [
        { label: "견적 요청", value: formatCount(service.requestedCount, "건") },
        { label: "견적 제안", value: formatCount(service.submittedCount, "건") },
        {
          label: "견적 확정",
          value: formatCount(service.confirmedCount, "건"),
          highlighted: true,
        },
        {
          label: "이사 완료",
          value: formatCount(service.completedCount, "건"),
          valueSize: "large",
        },
      ],
    },

    contentSummary: {
      title: "콘텐츠 관리 현황",
      description: "관리자가 숨김 처리한 누적 건수입니다.",
      items: [
        {
          label: "리뷰",
          value: `숨김 ${formatCount(contents.hiddenReviewCount, "건")}`,
          tone: contents.hiddenReviewCount > 0 ? "accent" : "default",
        },
        {
          label: "거주 후기",
          value: `숨김 ${formatCount(contents.hiddenResidenceReviewCount, "건")}`,
          tone: contents.hiddenResidenceReviewCount > 0 ? "accent" : "default",
        },
        {
          label: "나눔 게시글",
          value: `숨김 ${formatCount(contents.hiddenGiveawayCount, "건")}`,
          tone: contents.hiddenGiveawayCount > 0 ? "accent" : "default",
        },
        {
          // 공지·FAQ 는 isVisible=false 를 숨김으로 봅니다(백엔드 주석 참고).
          label: "공지 / FAQ",
          value: `숨김 ${formatCount(contents.hiddenNoticeCount + contents.hiddenFaqCount, "건")}`,
          tone: "default",
        },
      ],
    },

    recentActivities: {
      title: "최근 관리자 활동",
      description: "운영 처리 이력과 관리자 로그를 확인합니다.",
      items: recent.activities.map((activity) => ({
        action: activity.action,
        memo: activity.memo ?? `${activity.targetType} 처리`,
        timeAgo: `${activity.actor ? `${activity.actor.name} · ` : ""}${formatTimeAgo(activity.createdAt)}`,
      })),
    },
  };
}
