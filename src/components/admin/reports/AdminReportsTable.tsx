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
    <div className="overflow-hidden rounded-2xl border border-[#efefef]">
      <div className="bg-background text-muted grid grid-cols-[72px_100px_96px_108px_minmax(0,1fr)_88px_68px] text-sm">
        {["ID", "상태", "대상", "신고자", "사유", "접수일", ""].map((label) => (
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
            className={cn(
              "grid grid-cols-[72px_100px_96px_108px_minmax(0,1fr)_88px_68px] border-t border-[#efefef] text-sm",
              isActive ? "bg-[#fff7f3]" : "bg-surface",
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
            <div className="truncate px-3 py-4 text-muted">{getAdminReportListTargetText(report)}</div>
            <div className="truncate px-3 py-4 text-muted">{report.reporter.name}</div>
            <div className="truncate px-3 py-4 text-muted">{getAdminReportReasonLabel(report.reason)}</div>
            <div className="px-3 py-4 text-muted">{formatAdminReportDate(report.createdAt)}</div>
            <div className="px-3 py-4">
              <button
                type="button"
                className="text-muted text-sm"
                onClick={() => onSelectReport(report.id)}
                aria-pressed={isActive}
              >
                보기
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
