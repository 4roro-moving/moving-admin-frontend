import type { AdminGiveawaySort, AdminGiveawayStatus } from "@/types/adminGiveaway";

export const ADMIN_GIVEAWAY_SORT_OPTIONS: Array<{
  value: AdminGiveawaySort;
  label: string;
}> = [
  { value: "LATEST", label: "최신순" },
  { value: "OLDEST", label: "오래된순" },
  { value: "REPORT_HIGH", label: "신고 많은순" },
];

export const ADMIN_GIVEAWAY_LIST_PAGE_LIMIT = 10;

export const ADMIN_GIVEAWAY_STATUS_LABEL: Record<AdminGiveawayStatus, string> = {
  AVAILABLE: "나눔 가능",
  IN_PROGRESS: "나눔 중",
  COMPLETED: "나눔 완료",
};
