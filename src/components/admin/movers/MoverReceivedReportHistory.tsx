import UserHistoryCard from "@/components/admin/users/UserHistoryCard";
import ReportHistoryTable from "@/components/admin/users/ReportHistoryTable";
import type { AdminMoverDetail } from "@/types/adminMoverDetail";

interface MoverReceivedReportHistoryProps {
  history: AdminMoverDetail["reportHistory"]["received"];
  onDetail: (reportId: number) => void;
}

export default function MoverReceivedReportHistory({
  history,
  onDetail,
}: MoverReceivedReportHistoryProps) {
  return (
    <UserHistoryCard title="피신고 이력" totalCount={history.totalCount}>
      <ReportHistoryTable items={history.items} onDetail={onDetail} />
    </UserHistoryCard>
  );
}
