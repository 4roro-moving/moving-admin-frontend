function getDateParts(value: string, withTime: boolean) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
    timeZone: "Asia/Seoul",
  }).formatToParts(date);
}

function getPartValue(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export function formatKoreanDate(input: string) {
  const parts = getDateParts(input, false);
  return parts
    ? `${getPartValue(parts, "year")}.${getPartValue(parts, "month")}.${getPartValue(parts, "day")}`
    : "";
}

export function formatKoreanDateTime(input: string) {
  const parts = getDateParts(input, true);
  return parts
    ? `${getPartValue(parts, "year")}.${getPartValue(parts, "month")}.${getPartValue(parts, "day")} ${getPartValue(parts, "hour")}:${getPartValue(parts, "minute")}`
    : "";
}
