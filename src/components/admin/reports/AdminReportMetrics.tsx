import type { AdminReportSummary } from "@/types/adminReport";

interface AdminReportMetricsProps {
  summary: AdminReportSummary;
}

const METRIC_ITEMS = [
  {
    key: "totalCount",
    label: "전체 신고",
    subLabel: "누적 신고 건수",
  },
  {
    key: "pendingCount",
    label: "처리 대기",
    subLabel: "현재 확인이 필요한 건",
  },
  {
    key: "resolvedCount",
    label: "처리 완료",
    subLabel: "조치 완료된 신고",
  },
  {
    key: "rejectedCount",
    label: "반려",
    subLabel: "반려 처리된 신고",
  },
] as const;

export default function AdminReportMetrics({ summary }: AdminReportMetricsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {METRIC_ITEMS.map((item) => (
        <article key={item.key} className="border-border bg-surface rounded-2xl border p-5">
          <p className="text-muted text-sm">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {summary[item.key].toLocaleString("ko-KR")}건
          </p>
          <p className="text-muted mt-2 text-sm">{item.subLabel}</p>
        </article>
      ))}
    </div>
  );
}
