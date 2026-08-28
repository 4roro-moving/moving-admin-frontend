import UserHistoryCard from "@/components/admin/users/UserHistoryCard";
import ReportHistoryTable from "@/components/admin/users/ReportHistoryTable";
import type { AdminMoverDetail } from "@/types/adminMoverDetail";

interface MoverFiledReportHistoryProps {
  history: AdminMoverDetail["reportHistory"]["filed"];
  onDetail: (reportId: number) => void;
}

export default function MoverFiledReportHistory({
  history,
  onDetail,
}: MoverFiledReportHistoryProps) {
  return (
    <UserHistoryCard title="신고 이력" totalCount={history.totalCount}>
      <ReportHistoryTable
        items={history.items}
        showTarget
        onDetail={onDetail}
      />
    </UserHistoryCard>
  );
}
