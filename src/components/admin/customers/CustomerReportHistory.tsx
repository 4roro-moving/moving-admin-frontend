import UserHistoryCard from "@/components/admin/users/UserHistoryCard";
import ReportHistoryTable from "@/components/admin/users/ReportHistoryTable";
import type { AdminCustomerDetail } from "@/types/adminCustomerDetail";

interface CustomerReportHistoryProps {
  history: AdminCustomerDetail["reportHistory"];
  onDetail: (reportId: number) => void;
}

export default function CustomerReportHistory({
  history,
  onDetail,
}: CustomerReportHistoryProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <UserHistoryCard title="신고 이력" totalCount={history.filed.totalCount}>
        <ReportHistoryTable
          items={history.filed.items}
          showTarget
          onDetail={onDetail}
        />
      </UserHistoryCard>
      <UserHistoryCard
        title="피신고 이력"
        totalCount={history.received.totalCount}
      >
        <ReportHistoryTable
          items={history.received.items}
          showTarget
          onDetail={onDetail}
        />
      </UserHistoryCard>
    </div>
  );
}
