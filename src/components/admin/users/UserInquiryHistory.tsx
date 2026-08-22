import Text from "@/components/admin/common/Text";
import UserHistoryCard, {
  UserHistoryEmpty,
} from "@/components/admin/users/UserHistoryCard";
import { cn } from "@/lib/utils/cn";
import { formatKoreanDateTime } from "@/lib/utils/date";
import type { AdminInquiryHistory } from "@/types/adminUser";

const categoryLabel: Record<string, string> = {
  SUSPENSION_APPEAL: "계정 정지 이의 제기",
};

const statusLabel: Record<string, string> = {
  OPEN: "답변 대기",
  CLOSED: "처리 완료",
};

function getCategoryLabel(category: string) {
  return categoryLabel[category] ?? category;
}

function getStatusLabel(status: string) {
  return statusLabel[status] ?? status;
}

interface UserInquiryHistoryProps {
  history: AdminInquiryHistory;
}

export default function UserInquiryHistory({
  history,
}: UserInquiryHistoryProps) {
  return (
    <UserHistoryCard
      title="문의 이력"
      totalCount={history.totalCount}
      summaryLabel={`답변 대기 ${history.openCount}건 · 최근 5건`}
    >
      {history.items.length ? (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[10rem_minmax(14rem,1.5fr)_8rem_10rem_10rem_9rem] gap-4 border-b border-border bg-background-muted px-5 py-3 text-xs font-semibold text-muted">
              <span>카테고리</span>
              <span>제목</span>
              <span>상태</span>
              <span>마지막 대화</span>
              <span>생성일</span>
              <span>처리 관리자</span>
            </div>
            <div className="divide-y divide-border">
              {history.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[10rem_minmax(14rem,1.5fr)_8rem_10rem_10rem_9rem] items-center gap-4 px-5 py-4"
                >
                  <Text as="p" variant="sm-medium" className="text-text-secondary">
                    {getCategoryLabel(item.category)}
                  </Text>
                  <Text as="p" variant="md-medium" className="truncate text-foreground">
                    {item.title}
                  </Text>
                  <span
                    className={cn(
                      "w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
                      item.status === "OPEN"
                        ? "bg-status-progress-background text-status-progress-foreground"
                        : "bg-status-active-background text-status-active-foreground",
                    )}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                  <Text as="p" variant="sm-medium" className="text-text-secondary">
                    {formatKoreanDateTime(item.lastMessageAt)}
                  </Text>
                  <Text as="p" variant="sm-medium" className="text-text-secondary">
                    {formatKoreanDateTime(item.createdAt)}
                  </Text>
                  <Text as="p" variant="md-medium" className="text-foreground">
                    {item.handledBy?.name ?? "-"}
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
