import {
  ADMIN_REPORT_REASON_OPTIONS,
  ADMIN_REPORT_SORT_OPTIONS,
  ADMIN_REPORT_STATUS_OPTIONS,
  ADMIN_REPORT_TARGET_OPTIONS,
} from "@/lib/constants/adminReports";
import { cn } from "@/lib/utils/cn";
import type {
  AdminReportReason,
  AdminReportSort,
  AdminReportStatus,
  AdminReportTargetType,
} from "@/types/adminReport";

interface AdminReportStatusFiltersProps {
  status: AdminReportStatus | "ALL";
  targetType: AdminReportTargetType | "ALL";
  reason: AdminReportReason | "ALL";
  sort: AdminReportSort;
  onChangeStatus: (value: AdminReportStatus | "ALL") => void;
  onChangeTargetType: (value: AdminReportTargetType | "ALL") => void;
  onChangeReason: (value: AdminReportReason | "ALL") => void;
  onChangeSort: (value: AdminReportSort) => void;
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3.5 py-2 text-sm transition",
        active
          ? "border-accent bg-accent-muted text-accent font-semibold"
          : "border-border bg-surface text-muted font-medium",
      )}
    >
      {label}
    </button>
  );
}

export default function AdminReportStatusFilters({
  status,
  targetType,
  reason,
  sort,
  onChangeStatus,
  onChangeTargetType,
  onChangeReason,
  onChangeSort,
}: AdminReportStatusFiltersProps) {
  return (
    <div className="flex flex-col gap-2">
      <div role="group" aria-label="신고 상태 필터" className="flex flex-wrap gap-2">
        {ADMIN_REPORT_STATUS_OPTIONS.map((option) => (
          <FilterChip
            key={option.value}
            active={status === option.value}
            label={option.label}
            onClick={() => onChangeStatus(option.value)}
          />
        ))}
      </div>
      <div
        role="group"
        aria-label="신고 대상 유형 필터"
        className="flex flex-wrap gap-2"
      >
        {ADMIN_REPORT_TARGET_OPTIONS.map((option) => (
          <FilterChip
            key={option.value}
            active={targetType === option.value}
            label={option.label}
            onClick={() => onChangeTargetType(option.value)}
          />
        ))}
      </div>
      <div role="group" aria-label="신고 사유 필터" className="flex flex-wrap gap-2">
        {ADMIN_REPORT_REASON_OPTIONS.map((option) => (
          <FilterChip
            key={option.value}
            active={reason === option.value}
            label={option.label}
            onClick={() => onChangeReason(option.value)}
          />
        ))}
      </div>
      <div role="group" aria-label="정렬 기준 필터" className="flex flex-wrap gap-2">
        {ADMIN_REPORT_SORT_OPTIONS.map((option) => (
          <FilterChip
            key={option.value}
            active={sort === option.value}
            label={option.label}
            onClick={() => onChangeSort(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
