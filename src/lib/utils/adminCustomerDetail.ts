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

function value(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export function formatCustomerDetailDate(input: string) {
  const parts = getDateParts(input, false);
  return parts
    ? `${value(parts, "year")}.${value(parts, "month")}.${value(parts, "day")}`
    : "";
}

export function formatCustomerDetailDateTime(input: string) {
  const parts = getDateParts(input, true);
  return parts
    ? `${value(parts, "year")}.${value(parts, "month")}.${value(parts, "day")} ${value(parts, "hour")}:${value(parts, "minute")}`
    : "";
}
