import type {
  AdminInquiryCategory,
  AdminInquiryStatus,
} from "@/types/adminInquiry";

export function formatAdminInquiryDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";

  return `${year}.${month}.${day}`;
}

export function formatAdminInquiryDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

export function getAdminInquiryCategoryLabel(category: AdminInquiryCategory) {
  switch (category) {
    case "SUSPENSION_APPEAL":
      return "정지 이의 제기";
    case "ACCOUNT":
      return "계정";
    case "SERVICE":
      return "서비스";
    default:
      return "기타";
  }
}

export function getAdminInquiryStatusLabel(status: AdminInquiryStatus) {
  switch (status) {
    case "OPEN":
      return "답변 대기";
    case "ANSWERED":
      return "답변 완료";
    default:
      return "문의 종료";
  }
}

export function getAdminInquiryStatusTone(status: AdminInquiryStatus) {
  switch (status) {
    case "OPEN":
      return "bg-[#fff5f0] text-[#f9502e]";
    case "ANSWERED":
      return "bg-[#f0faf2] text-[#32a753]";
    default:
      return "bg-background text-muted";
  }
}
