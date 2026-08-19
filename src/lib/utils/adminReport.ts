import {
  ADMIN_REPORT_REASON_LABELS,
  ADMIN_REPORT_STATUS_LABELS,
  ADMIN_REPORT_TARGET_LABELS,
} from "@/lib/constants/adminReports";
import type {
  AdminReportDetail,
  AdminReportListItem,
  AdminReportReason,
  AdminReportStatus,
  AdminReportTarget,
  AdminReportTargetType,
} from "@/types/adminReport";

export function formatAdminReportDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const dateParts = new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  }).formatToParts(date);
  const month = dateParts.find((part) => part.type === "month")?.value;
  const day = dateParts.find((part) => part.type === "day")?.value;

  if (!month || !day) {
    return "";
  }

  return `${month}/${day}`;
}

export function formatAdminReportDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });

  return formatter.format(date).replace(/\./g, ".").replace(/\s/g, " ");
}

export function getAdminReportStatusLabel(status: AdminReportStatus): string {
  return ADMIN_REPORT_STATUS_LABELS[status];
}

export function getAdminReportReasonLabel(reason: AdminReportReason): string {
  return ADMIN_REPORT_REASON_LABELS[reason];
}

export function getAdminReportTargetLabel(targetType: AdminReportTargetType): string {
  return ADMIN_REPORT_TARGET_LABELS[targetType];
}

export function getAdminReportListTargetText(report: AdminReportListItem): string {
  if (report.targetType === "REVIEW") {
    return `리뷰 #${report.targetId}`;
  }

  if (report.targetType === "RESIDENCE_REVIEW") {
    return `거주후기 #${report.targetId}`;
  }

  if (report.targetType === "GIVEAWAY") {
    return `나눔 #${report.targetId}`;
  }

  return getAdminReportTargetLabel(report.targetType);
}

export function getAdminReportDetailTargetTitle(report: AdminReportDetail): string {
  if (!report.target) {
    return `${getAdminReportTargetLabel(report.targetType)} 대상 정보를 찾을 수 없습니다.`;
  }

  switch (report.target.type) {
    case "REVIEW":
      return `리뷰 #${report.target.id}`;
    case "MOVER":
      return report.target.nickname ? `${report.target.nickname} 기사님` : report.target.name;
    case "RESIDENCE_REVIEW":
      return report.target.title;
    case "GIVEAWAY":
      return report.target.title;
  }
}

export function getAdminReportDetailTargetContent(target: AdminReportTarget | null): string {
  if (!target) {
    return "신고 대상이 삭제되었거나 현재 조회할 수 없습니다.";
  }

  switch (target.type) {
    case "REVIEW":
      return target.content;
    case "MOVER":
      return [
        `이름: ${target.name}`,
        `이메일: ${target.email}`,
        `닉네임: ${target.nickname ?? "없음"}`,
        `활성 상태: ${target.isActive ? "활성" : "비활성"}`,
      ].join("\n");
    case "RESIDENCE_REVIEW":
      return target.content;
    case "GIVEAWAY":
      return target.description;
  }
}

export function getAdminReportDetailMeta(target: AdminReportTarget | null): string | null {
  if (!target) {
    return null;
  }

  switch (target.type) {
    case "REVIEW":
      return `작성자 ${target.author.name} · 평점 ${target.rating}점`;
    case "MOVER":
      return `기사 ID ${target.id}`;
    case "RESIDENCE_REVIEW":
      return `작성자 ${target.author.name} · 지역 ${target.region.name} · 평점 ${target.rating}점`;
    case "GIVEAWAY":
      return `작성자 ${target.author.name} · 지역 ${target.region?.name ?? "미지정"} · 상태 ${target.status}`;
  }
}

export function getAdminReportStatusTone(status: AdminReportStatus): string {
  switch (status) {
    case "RESOLVED":
      return "bg-emerald-50 text-emerald-600";
    case "REJECTED":
      return "bg-red-50 text-red-600";
    case "PENDING":
    default:
      return "bg-accent-muted text-accent";
  }
}
