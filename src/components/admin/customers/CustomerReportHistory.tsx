import Text from "@/components/admin/common/Text";
import CustomerHistoryCard, {
  CustomerHistoryEmpty,
} from "@/components/admin/customers/CustomerHistoryCard";
import { formatCustomerDetailDate } from "@/lib/utils/adminCustomerDetail";
import { cn } from "@/lib/utils/cn";
import type { AdminCustomerDetail } from "@/types/adminCustomerDetail";

const target = {
  REVIEW: "이사 리뷰",
  MOVER: "기사",
  RESIDENCE_REVIEW: "거주 후기",
  GIVEAWAY: "나눔 글",
} as const;

const reason = {
  SPAM: "스팸·광고",
  ABUSE: "욕설·비방",
  FALSE_INFO: "허위 정보",
  INAPPROPRIATE: "부적절한 내용",
  PRIVACY: "개인정보 노출",
  OTHER: "기타",
} as const;

const status = {
  PENDING: "처리 대기",
  RESOLVED: "처리 완료",
  REJECTED: "처리 반려",
} as const;

const reportStatusClass = {
  PENDING: "bg-report-pending-background text-report-pending-foreground",
  RESOLVED: "bg-status-active-background text-status-active-foreground",
  REJECTED: "bg-status-neutral-background text-status-neutral-foreground",
} as const;

type Items = AdminCustomerDetail["reportHistory"]["filed"]["items"];

interface CustomerReportHistoryTableProps {
  items: Items;
  onDetail: (id: number) => void;
}

interface CustomerReportHistoryProps {
  history: AdminCustomerDetail["reportHistory"];
  onDetail: (id: number) => void;
}

function Table({
  items,
  onDetail,
}: CustomerReportHistoryTableProps) {
  return items.length ? (
    <div className="overflow-x-auto">
      <div className="min-w-[680px]">
        <div className="grid grid-cols-[1fr_1.25fr_1fr_8rem_6rem] gap-3 border-b border-border bg-background-muted px-5 py-3 text-xs font-semibold text-muted">
          <span>신고 대상</span>
          <span>신고 사유</span>
          <span>처리 상태</span>
          <span>접수일</span>
          <span>관리</span>
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_1.25fr_1fr_8rem_6rem] items-center gap-3 px-5 py-4"
            >
              <Text as="p" variant="md-medium" className="text-foreground">
                {target[item.targetType]}
              </Text>
              <Text as="p" variant="md-medium" className="text-foreground">
                {reason[item.reason]}
              </Text>
              <span
                className={cn(
                  "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
                  reportStatusClass[item.status],
                )}
              >
                {status[item.status]}
              </span>
              <Text as="p" variant="sm-medium" className="text-text-secondary">
                {formatCustomerDetailDate(item.createdAt)}
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
  ) : (
    <CustomerHistoryEmpty />
  );
}

export default function CustomerReportHistory({
  history,
  onDetail,
}: CustomerReportHistoryProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <CustomerHistoryCard
        title="신고 이력"
        totalCount={history.filed.totalCount}
      >
        <Table items={history.filed.items} onDetail={onDetail} />
      </CustomerHistoryCard>
      <CustomerHistoryCard
        title="피신고 이력"
        totalCount={history.received.totalCount}
      >
        <Table items={history.received.items} onDetail={onDetail} />
      </CustomerHistoryCard>
    </div>
  );
}
