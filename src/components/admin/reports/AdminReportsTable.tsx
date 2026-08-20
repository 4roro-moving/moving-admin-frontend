"use client";

import { cn } from "@/lib/utils/cn";
import {
  formatAdminReportDate,
  getAdminReportListTargetText,
  getAdminReportReasonLabel,
  getAdminReportStatusLabel,
  getAdminReportStatusTone,
} from "@/lib/utils/adminReport";
import type { AdminReportListItem } from "@/types/adminReport";

interface AdminReportsTableProps {
  items: AdminReportListItem[];
  selectedReportId: number | null;
  onSelectReport: (reportId: number) => void;
}

export default function AdminReportsTable({
  items,
  selectedReportId,
  onSelectReport,
}: AdminReportsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#efefef]">
      <div className="min-w-[652px]">
        <div className="bg-background text-muted grid grid-cols-[72px_100px_96px_108px_minmax(0,1fr)_88px] text-sm">
          {["ID", "상태", "대상", "신고자", "사유", "접수일"].map((label) => (
            <div key={label || "action"} className="px-3 py-3">
              {label}
            </div>
          ))}
        </div>

        {items.map((report) => {
          const isActive = report.id === selectedReportId;

          return (
            <div
              key={report.id}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`신고 ${report.id} 상세 보기`}
              onClick={() => onSelectReport(report.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectReport(report.id);
                }
              }}
              className={cn(
                "grid grid-cols-[72px_100px_96px_108px_minmax(0,1fr)_88px] cursor-pointer border-t border-[#efefef] text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f9502e]/30",
                isActive
                  ? "bg-[#fff7f3]"
                  : "bg-surface hover:bg-[#faf7f6]",
              )}
            >
              <div className="px-3 py-4 text-muted">#{report.id}</div>
              <div className="px-3 py-4">
                <span
                  className={cn(
                    "inline-flex min-w-[64px] items-center justify-center rounded-full px-2.5 py-1 text-xs",
                    getAdminReportStatusTone(report.status),
                  )}
                >
                  {getAdminReportStatusLabel(report.status)}
                </span>
              </div>
              <div className="truncate px-3 py-4 text-muted">
                {getAdminReportListTargetText(report)}
              </div>
              <div className="truncate px-3 py-4 text-muted">
                {report.reporter.name}
              </div>
              <div className="truncate px-3 py-4 text-muted">
                {getAdminReportReasonLabel(report.reason)}
              </div>
              <div className="px-3 py-4 text-muted">
                {formatAdminReportDate(report.createdAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
