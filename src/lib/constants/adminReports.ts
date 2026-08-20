import type {
  AdminReportReason,
  AdminReportSort,
  AdminReportStatus,
  AdminReportTargetType,
} from "@/types/adminReport";

export const ADMIN_REPORT_LIST_PAGE_LIMIT = 5;

export const ADMIN_REPORT_STATUS_OPTIONS: Array<{
  value: AdminReportStatus | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "전체" },
  { value: "PENDING", label: "대기" },
  { value: "RESOLVED", label: "처리 완료" },
  { value: "REJECTED", label: "반려" },
];

export const ADMIN_REPORT_TARGET_OPTIONS: Array<{
  value: AdminReportTargetType | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "대상 전체" },
  { value: "REVIEW", label: "리뷰" },
  { value: "MOVER", label: "기사" },
  { value: "RESIDENCE_REVIEW", label: "거주후기" },
  { value: "GIVEAWAY", label: "나눔" },
];

export const ADMIN_REPORT_REASON_OPTIONS: Array<{
  value: AdminReportReason | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "사유 전체" },
  { value: "SPAM", label: "스팸/광고" },
  { value: "ABUSE", label: "욕설/비방" },
  { value: "FALSE_INFO", label: "허위 정보" },
  { value: "INAPPROPRIATE", label: "부적절한 내용" },
  { value: "PRIVACY", label: "개인정보 노출" },
  { value: "OTHER", label: "기타" },
];

export const ADMIN_REPORT_SORT_OPTIONS: Array<{
  value: AdminReportSort;
  label: string;
}> = [
  { value: "LATEST", label: "최신순" },
  { value: "OLDEST", label: "오래된순" },
];

export const ADMIN_REPORT_STATUS_LABELS: Record<AdminReportStatus, string> = {
  PENDING: "대기",
  RESOLVED: "처리 완료",
  REJECTED: "반려",
};

export const ADMIN_REPORT_REASON_LABELS: Record<AdminReportReason, string> = {
  SPAM: "스팸/광고",
  ABUSE: "욕설/비방",
  FALSE_INFO: "허위 정보",
  INAPPROPRIATE: "부적절한 내용",
  PRIVACY: "개인정보 노출",
  OTHER: "기타",
} as const;

export const ADMIN_REPORT_TARGET_LABELS: Record<AdminReportTargetType, string> = {
  REVIEW: "리뷰",
  MOVER: "기사",
  RESIDENCE_REVIEW: "거주후기",
  GIVEAWAY: "나눔",
};
