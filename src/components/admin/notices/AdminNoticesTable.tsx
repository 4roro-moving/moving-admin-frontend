"use client";

import { cn } from "@/lib/utils/cn";
import type { AdminNotice } from "@/types/adminNotice";

interface AdminNoticesTableProps {
  items: AdminNotice[];
  onEditNotice: (noticeId: number) => void;
}

function formatNoticeDate(value: string) {
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

function getNoticeStatusLabel(isVisible: boolean) {
  return isVisible ? "게시중" : "숨김";
}

function getNoticeStatusTone(isVisible: boolean) {
  return isVisible
    ? "bg-[#dcfce7] text-[#2f855a]"
    : "bg-background text-muted";
}

function getAudienceLabel(audience: AdminNotice["audience"]) {
  switch (audience) {
    case "CUSTOMER":
      return "고객";
    case "MOVER":
      return "기사";
    default:
      return "전체";
  }
}

export default function AdminNoticesTable({
  items,
  onEditNotice,
}: AdminNoticesTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-[#efefef] xl:block">
        <div className="min-w-[824px]">
          <div className="grid grid-cols-[72px_minmax(0,1fr)_120px_132px_150px] bg-background text-sm text-muted">
            {["ID", "제목", "상태", "작성자", "작성일"].map((label) => (
              <div key={label} className="px-3 py-3">
                {label}
              </div>
            ))}
          </div>

          {items.map((notice) => (
            <div
              key={notice.id}
              role="button"
              tabIndex={0}
              aria-label={`공지사항 ${notice.title} 수정`}
              onClick={() => onEditNotice(notice.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onEditNotice(notice.id);
                }
              }}
              className="grid grid-cols-[72px_minmax(0,1fr)_120px_132px_150px] cursor-pointer border-t border-[#efefef] bg-surface text-sm transition-colors hover:bg-[#faf7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f9502e]/30"
            >
              <div className="px-3 py-4 text-muted">#{notice.id}</div>
              <div className="min-w-0 px-3 py-4 text-foreground">
                <div className="flex items-center gap-2">
                  <span className="truncate">{notice.title}</span>
                  {notice.isPinned ? (
                    <span className="inline-flex shrink-0 items-center rounded-full border border-accent/20 bg-accent-muted px-2 py-0.5 text-xs text-accent">
                      고정
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted">{getAudienceLabel(notice.audience)}</p>
              </div>
              <div className="px-3 py-4">
                <span
                  className={cn(
                    "inline-flex min-w-[56px] items-center justify-center rounded-full px-2.5 py-1 text-xs",
                    getNoticeStatusTone(notice.isVisible),
                  )}
                >
                  {getNoticeStatusLabel(notice.isVisible)}
                </span>
              </div>
              <div className="truncate px-3 py-4 text-foreground">{notice.authorId}</div>
              <div className="px-3 py-4 text-muted">{formatNoticeDate(notice.createdAt)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden gap-3 md:grid xl:hidden">
        {items.map((notice) => (
          <button
            key={notice.id}
            type="button"
            onClick={() => onEditNotice(notice.id)}
            className="grid w-full grid-cols-[60px_minmax(0,1fr)_90px_174px] items-start rounded-[10px] border border-[#e8e5e3] bg-surface text-left transition hover:bg-[#faf7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <span className="px-3 py-4 text-sm leading-6 text-muted">#{notice.id}</span>
            <span className="min-w-0 px-3 py-4 text-sm leading-6 text-foreground">
              <span className="flex items-center gap-2">
                <span className="truncate">{notice.title}</span>
                {notice.isPinned ? (
                  <span className="inline-flex shrink-0 items-center rounded-full border border-accent/20 bg-accent-muted px-2 py-0.5 text-[11px] text-accent">
                    고정
                  </span>
                ) : null}
              </span>
            </span>
            <span className="px-3 py-4">
              <span
                className={cn(
                  "inline-flex min-w-[49px] items-center justify-center rounded-full px-[9px] py-[5px] text-[11px] leading-none",
                  getNoticeStatusTone(notice.isVisible),
                )}
              >
                {getNoticeStatusLabel(notice.isVisible)}
              </span>
            </span>
            <span className="px-3 py-4 text-right text-sm leading-6 text-muted">
              {formatNoticeDate(notice.createdAt)}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:hidden">
        {items.map((notice) => (
          <button
            key={notice.id}
            type="button"
            onClick={() => onEditNotice(notice.id)}
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-left transition hover:bg-[#faf7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{notice.title}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs",
                      getNoticeStatusTone(notice.isVisible),
                    )}
                  >
                    {getNoticeStatusLabel(notice.isVisible)}
                  </span>
                  {notice.isPinned ? (
                    <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent-muted px-2 py-0.5 text-[11px] text-accent">
                      상단 고정
                    </span>
                  ) : null}
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted">{formatNoticeDate(notice.createdAt)}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
