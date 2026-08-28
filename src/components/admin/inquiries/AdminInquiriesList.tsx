"use client";

import { cn } from "@/lib/utils/cn";
import {
  formatAdminInquiryDate,
  getAdminInquiryCategoryLabel,
  getAdminInquiryStatusLabel,
  getAdminInquiryStatusTone,
} from "@/lib/utils/adminInquiry";
import type { AdminInquiryListItem } from "@/types/adminInquiry";

interface AdminInquiriesListProps {
  items: AdminInquiryListItem[];
  selectedInquiryId: number | null;
  onSelectInquiry: (inquiryId: number) => void;
}

export default function AdminInquiriesList({
  items,
  selectedInquiryId,
  onSelectInquiry,
}: AdminInquiriesListProps) {
  return (
    <div className="grid gap-3">
      {items.map((inquiry) => {
        const isActive = inquiry.id === selectedInquiryId;

        return (
          <button
            key={inquiry.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectInquiry(inquiry.id)}
            className={cn(
              "w-full rounded-[10px] border border-[#e8e5e3] bg-surface px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
              isActive ? "bg-[#fff7f3]" : "hover:bg-[#faf7f6]",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={cn(
                  "inline-flex shrink-0 items-center justify-center rounded-full px-2.5 py-1 text-[11px]",
                  getAdminInquiryStatusTone(inquiry.status),
                )}
              >
                {getAdminInquiryStatusLabel(inquiry.status)}
              </span>
              <span className="shrink-0 text-xs text-muted">
                {formatAdminInquiryDate(inquiry.lastMessageAt)}
              </span>
            </div>

            <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
              {inquiry.title}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
              <span>{getAdminInquiryCategoryLabel(inquiry.category)}</span>
              {inquiry.handledBy ? <span>담당 {inquiry.handledBy}</span> : null}
              {inquiry.closedAt ? <span>종료됨</span> : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
