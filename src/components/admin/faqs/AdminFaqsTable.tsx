"use client";

import { cn } from "@/lib/utils/cn";
import type { AdminFaq } from "@/types/adminFaq";

interface AdminFaqsTableProps {
  items: AdminFaq[];
  onEditFaq: (faqId: number) => void;
}

function formatFaqDate(value: string) {
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

function getFaqStatusLabel(isVisible: boolean) {
  return isVisible ? "노출" : "숨김";
}

function getFaqStatusTone(isVisible: boolean) {
  return isVisible ? "bg-[#dcfce7] text-[#2f855a]" : "bg-background text-muted";
}

export default function AdminFaqsTable({ items, onEditFaq }: AdminFaqsTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-[#efefef] xl:block">
        <div className="min-w-[860px]">
          <div className="grid grid-cols-[72px_minmax(0,1fr)_110px_110px_150px] bg-background text-sm text-muted">
            {["ID", "질문", "정렬", "상태", "작성일"].map((label) => (
              <div key={label} className="px-3 py-3">
                {label}
              </div>
            ))}
          </div>

          {items.map((faq) => (
            <div
              key={faq.id}
              role="button"
              tabIndex={0}
              aria-label={`FAQ ${faq.question} 수정`}
              onClick={() => onEditFaq(faq.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onEditFaq(faq.id);
                }
              }}
              className="grid grid-cols-[72px_minmax(0,1fr)_110px_110px_150px] cursor-pointer border-t border-[#efefef] bg-surface text-sm transition-colors hover:bg-[#faf7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f9502e]/30"
            >
              <div className="px-3 py-4 text-muted">#{faq.id}</div>
              <div className="min-w-0 px-3 py-4 text-foreground">
                <p className="truncate">{faq.question}</p>
                <p className="mt-1 line-clamp-1 text-xs text-muted">{faq.answer}</p>
              </div>
              <div className="px-3 py-4 text-foreground">{faq.sortOrder}</div>
              <div className="px-3 py-4">
                <span
                  className={cn(
                    "inline-flex min-w-[56px] items-center justify-center rounded-full px-2.5 py-1 text-xs",
                    getFaqStatusTone(faq.isVisible),
                  )}
                >
                  {getFaqStatusLabel(faq.isVisible)}
                </span>
              </div>
              <div className="px-3 py-4 text-muted">{formatFaqDate(faq.createdAt)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden gap-3 md:grid xl:hidden">
        {items.map((faq) => (
          <button
            key={faq.id}
            type="button"
            onClick={() => onEditFaq(faq.id)}
            className="grid w-full grid-cols-[60px_minmax(0,1fr)_94px_144px] items-start rounded-[10px] border border-[#e8e5e3] bg-surface text-left transition hover:bg-[#faf7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <span className="px-3 py-4 text-sm leading-6 text-muted">#{faq.id}</span>
            <span className="min-w-0 px-3 py-4 text-sm leading-6 text-foreground">
              <span className="block truncate">{faq.question}</span>
              <span className="mt-1 block text-xs leading-5 text-muted">
                정렬 {faq.sortOrder}
              </span>
            </span>
            <span className="px-3 py-4">
              <span
                className={cn(
                  "inline-flex min-w-[49px] items-center justify-center rounded-full px-[9px] py-[5px] text-[11px] leading-none",
                  getFaqStatusTone(faq.isVisible),
                )}
              >
                {getFaqStatusLabel(faq.isVisible)}
              </span>
            </span>
            <span className="px-3 py-4 text-sm leading-6 text-muted">
              {formatFaqDate(faq.createdAt)}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:hidden">
        {items.map((faq) => (
          <button
            key={faq.id}
            type="button"
            onClick={() => onEditFaq(faq.id)}
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-left transition hover:bg-[#faf7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold text-foreground">{faq.question}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                  <span>정렬 {faq.sortOrder}</span>
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px]",
                  getFaqStatusTone(faq.isVisible),
                )}
              >
                {getFaqStatusLabel(faq.isVisible)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
