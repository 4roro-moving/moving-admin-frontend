export default function AdminReportSummaryBadge({
  pendingCount,
  totalCount,
}: {
  pendingCount: number;
  totalCount: number;
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <Text
        as="span"
        variant="xs-semibold"
        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pendingCount > 0 ? "bg-report-pending-background text-report-pending-foreground" : "bg-background text-text-subtle"}`}
      >
        미처리 {pendingCount}건
      </Text>
      <Text as="span" variant="xs-medium" className="text-text-subtle">총 {totalCount}건</Text>
    </div>
  );
}
import Text from "@/components/admin/common/Text";
