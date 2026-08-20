import Text from "@/components/admin/common/Text";
import CustomerHistoryCard, {
  CustomerHistoryEmpty,
} from "@/components/admin/customers/CustomerHistoryCard";
import { formatCustomerDetailDateTime } from "@/lib/utils/adminCustomerDetail";
import type { AdminCustomerDetail } from "@/types/adminCustomerDetail";

const actionLabel = { SUSPEND: "계정 정지", RELEASE: "정지 해제" } as const;

export default function CustomerSuspensionHistory({
  history,
}: {
  history: AdminCustomerDetail["suspensionHistory"];
}) {
  return (
    <CustomerHistoryCard
      title="계정 정지/해제 이력"
      totalCount={history.totalCount}
    >
      {history.items.length ? (
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[8rem_minmax(16rem,1fr)_minmax(16rem,1fr)_10rem_8rem] gap-4 border-b border-border bg-background-muted px-5 py-3 text-xs font-semibold text-muted">
              <span>조치</span>
              <span>사유</span>
              <span>메모</span>
              <span>처리일</span>
              <span>처리자</span>
            </div>
            <div className="divide-y divide-border">
              {history.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[8rem_minmax(16rem,1fr)_minmax(16rem,1fr)_10rem_8rem] items-center gap-4 px-5 py-4"
                >
                  <span
                    className={
                      item.action === "SUSPEND"
                        ? "inline-flex w-fit rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700"
                        : "inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                    }
                  >
                    {actionLabel[item.action]}
                  </span>
                  <Text as="p" variant="md-medium" className="text-foreground">
                    {item.reason}
                  </Text>
                  <Text as="p" variant="md-medium" className="text-text-secondary">
                    {item.internalNote ?? "-"}
                  </Text>
                  <Text
                    as="p"
                    variant="sm-medium"
                    className="text-text-secondary"
                  >
                    {formatCustomerDetailDateTime(item.createdAt)}
                  </Text>
                  <Text as="p" variant="md-medium" className="text-foreground">
                    {item.admin.name}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <CustomerHistoryEmpty />
      )}
    </CustomerHistoryCard>
  );
}
