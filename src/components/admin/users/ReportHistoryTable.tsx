import Text from "@/components/admin/common/Text";
import { formatKoreanDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type {
  AdminReportReason,
  AdminReportStatus,
  AdminReportTargetType,
} from "@/types/adminReport";

import { UserHistoryEmpty } from "./UserHistoryCard";

const reportTargetLabel = {
  REVIEW: "이사 리뷰",
  MOVER: "기사",
  RESIDENCE_REVIEW: "거주 후기",
  GIVEAWAY: "나눔 글",
} as const;

const reportReasonLabel = {
  SPAM: "스팸·광고",
  ABUSE: "욕설·비방",
  FALSE_INFO: "허위 정보",
  INAPPROPRIATE: "부적절한 내용",
  PRIVACY: "개인정보 노출",
  OTHER: "기타",
} as const;

const reportStatusLabel = {
  PENDING: "처리 대기",
  RESOLVED: "처리 완료",
  REJECTED: "처리 반려",
} as const;

const reportStatusClass = {
  PENDING: "bg-report-pending-background text-report-pending-foreground",
  RESOLVED: "bg-status-active-background text-status-active-foreground",
  REJECTED: "bg-status-neutral-background text-status-neutral-foreground",
} as const;

interface ReportHistoryItem {
  id: number;
  targetType?: AdminReportTargetType;
  reason: AdminReportReason;
  status: AdminReportStatus;
  createdAt: string;
}

interface ReportHistoryTableProps<T extends ReportHistoryItem> {
  items: T[];
  showTarget?: boolean;
  onDetail: (reportId: number) => void;
}

export default function ReportHistoryTable<T extends ReportHistoryItem>({
  items,
  showTarget = false,
  onDetail,
}: ReportHistoryTableProps<T>) {
  if (!items.length) return <UserHistoryEmpty />;

  const gridClassName = showTarget
    ? "grid-cols-[1fr_1.25fr_1fr_8rem_6rem]"
    : "grid-cols-[1.25fr_1fr_8rem_6rem]";
  const minWidthClassName = showTarget ? "min-w-[680px]" : "min-w-[560px]";

  return (
    <div className="overflow-x-auto">
      <div className={minWidthClassName}>
        <div className={cn("grid gap-3 border-b border-border bg-background-muted px-5 py-3 text-xs font-semibold text-muted", gridClassName)}>
          {showTarget ? <span>신고 대상</span> : null}
          <span>신고 사유</span>
          <span>처리 상태</span>
          <span>접수일</span>
          <span>관리</span>
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "grid items-center gap-3 px-5 py-4",
                gridClassName,
              )}
            >
              {showTarget ? (
                <Text as="p" variant="md-medium" className="text-foreground">
                  {item.targetType ? reportTargetLabel[item.targetType] : "-"}
                </Text>
              ) : null}
              <Text as="p" variant="md-medium" className="text-foreground">
                {reportReasonLabel[item.reason]}
              </Text>
              <span
                className={cn(
                  "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
                  reportStatusClass[item.status],
                )}
              >
                {reportStatusLabel[item.status]}
              </span>
              <Text as="p" variant="sm-medium" className="text-text-secondary">
                {formatKoreanDate(item.createdAt)}
              </Text>
              <button
                type="button"
                onClick={() => onDetail(item.id)}
                className="w-fit rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-background-hover"
              >
                상세 보기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
