import { HIDE_REASON_MAX_LENGTH, HIDE_REASON_MIN_LENGTH } from "@/lib/constants/adminReviews";

export function getHideReasonCharCount(reason: string): number {
  return reason.replace(/\s/g, "").length;
}

export function isValidHideReason(reason: string): boolean {
  const count = getHideReasonCharCount(reason);
  return count >= HIDE_REASON_MIN_LENGTH && count <= HIDE_REASON_MAX_LENGTH;
}

export function formatReviewDate(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  });

  return formatter.format(date).replace(/\./g, ".").replace(/\s/g, "");
}

export function renderStars(rating: number): string {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`;
}

export function getVisiblePages(currentPage: number, pageCount: number): number[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, pageCount, currentPage]);
  for (let offset = -1; offset <= 1; offset += 1) {
    const page = currentPage + offset;
    if (page > 1 && page < pageCount) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
