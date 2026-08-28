import Text from "@/components/admin/common/Text";
import UserHistoryCard, {
  UserHistoryEmpty,
} from "@/components/admin/users/UserHistoryCard";
import { formatKoreanDateTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { AdminSuspensionHistory } from "@/types/adminUser";

const actionLabel = { SUSPEND: "계정 정지", RELEASE: "정지 해제" } as const;

const suspensionActionClass = {
  SUSPEND: "bg-status-suspended-background text-status-suspended-foreground",
  RELEASE: "bg-status-active-background text-status-active-foreground",
} as const;

interface UserSuspensionHistoryProps {
  history: AdminSuspensionHistory;
}

export default function UserSuspensionHistory({
  history,
}: UserSuspensionHistoryProps) {
  return (
    <UserHistoryCard title="계정 정지/해제 이력" totalCount={history.totalCount}>
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
                    className={cn(
                      "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
                      suspensionActionClass[item.action],
                    )}
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
                    {formatKoreanDateTime(item.createdAt)}
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
        <UserHistoryEmpty />
      )}
    </UserHistoryCard>
  );
}
