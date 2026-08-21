import Link from "next/link";

import Text from "@/components/admin/common/Text";
import UserHistoryCard, {
  UserHistoryEmpty,
} from "@/components/admin/users/UserHistoryCard";
import { formatKoreanDate, formatKoreanDateTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import type { AdminEstimateCancellationTarget } from "@/types/adminEstimate";
import type { AdminMoverDetail } from "@/types/adminMoverDetail";

const inProgressStatusLabel = {
  SENT: "견적 발송",
  CONFIRMED: "거래 확정",
} as const;

const inProgressStatusClass = {
  SENT: "bg-status-progress-background text-status-progress-foreground",
  CONFIRMED: "bg-status-confirmed-background text-status-confirmed-foreground",
} as const;

const recentStatusLabel = {
  COMPLETED: "이사 완료",
  CANCELED: "거래 취소",
  EXPIRED: "견적 만료",
} as const;

const recentStatusClass = {
  COMPLETED: "bg-status-active-background text-status-active-foreground",
  CANCELED: "bg-status-suspended-background text-status-suspended-foreground",
  EXPIRED: "bg-status-neutral-background text-status-neutral-foreground",
} as const;

const statusBadgeClass =
  "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold";

const moveTypeLabel = {
  SMALL: "소형 이사",
  HOME: "가정 이사",
  OFFICE: "사무실 이사",
} as const;

function getInProgressStatusDate(
  item: AdminMoverDetail["estimateActivity"]["inProgress"]["items"][number],
) {
  if (item.status === "CONFIRMED" && item.confirmedAt) {
    return `${formatKoreanDateTime(item.confirmedAt)} 확정`;
  }

  return `${formatKoreanDateTime(item.createdAt)} 발송`;
}

function getRecentStatusDate(
  item: AdminMoverDetail["estimateActivity"]["recent"]["items"][number],
) {
  if (item.status === "COMPLETED" && item.confirmedAt) {
    return `${formatKoreanDateTime(item.confirmedAt)} 확정`;
  }

  if (item.status === "CANCELED" && item.canceledAt) {
    return `${formatKoreanDateTime(item.canceledAt)} 취소`;
  }

  if (item.status === "EXPIRED" && item.expiredAt) {
    return `${formatKoreanDateTime(item.expiredAt)} 만료`;
  }

  return "-";
}

interface MoverEstimateActivityProps {
  activity: AdminMoverDetail["estimateActivity"];
  moverId: string;
  moverName: string;
  moverNickname: string;
  onCancelConfirmedEstimate: (target: AdminEstimateCancellationTarget) => void;
}

function InProgressEstimates({
  history,
  moverId,
  moverName,
  moverNickname,
  onCancelConfirmedEstimate,
}: {
  history: AdminMoverDetail["estimateActivity"]["inProgress"];
  moverId: string;
  moverName: string;
  moverNickname: string;
  onCancelConfirmedEstimate: (target: AdminEstimateCancellationTarget) => void;
}) {
  return (
    <div id="in-progress-estimates" className="scroll-mt-6">
      <UserHistoryCard
        title="진행 중 견적 활동"
        totalCount={history.totalCount}
      >
      {history.items.length ? (
        <div>
          <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.8fr)] gap-3 border-b border-border bg-background-muted px-5 py-3 text-xs font-semibold text-muted">
              <span>이사 정보</span>
              <span>대상 고객</span>
              <span>상태</span>
              <span>견적가</span>
              <span>관리</span>
            </div>
            <div className="divide-y divide-border">
              {history.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.8fr)] items-center gap-3 px-5 py-4"
                >
                  <Text
                    as="div"
                    variant="md-medium"
                    className="flex flex-col gap-1 text-foreground"
                  >
                    <span className="font-semibold">
                      {formatKoreanDate(item.moveDate)}
                    </span>
                    <span>{moveTypeLabel[item.moveType]}</span>
                  </Text>
                  <Link
                    href={`${APP_ROUTES.CUSTOMERS}/${item.customer.id}`}
                    className="truncate text-sm font-medium text-foreground underline underline-offset-2 hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    title={`${item.customer.name} 고객 상세 보기`}
                  >
                    {item.customer.name}
                  </Link>
                  <div className="flex min-w-0 flex-col items-start gap-1">
                    <span
                      className={cn(
                        statusBadgeClass,
                        inProgressStatusClass[item.status],
                      )}
                    >
                      {inProgressStatusLabel[item.status]}
                    </span>
                    <Text
                      as="p"
                      variant="xs-medium"
                      className="text-text-secondary"
                    >
                      {getInProgressStatusDate(item)}
                    </Text>
                  </div>
                  <Text as="p" variant="md-semibold" className="text-foreground">
                    {item.price.toLocaleString("ko-KR")}원
                  </Text>
                  {item.status === "CONFIRMED" && item.cancelable ? (
                    <div className="flex flex-col items-start gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          onCancelConfirmedEstimate({
                            estimateId: item.id,
                            customerId: item.customer.id,
                            customerName: item.customer.name,
                            moverId,
                            moverName,
                            moverNickname,
                            moveDate: item.moveDate,
                            price: item.price,
                          })
                        }
                        className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-background-hover"
                      >
                        견적 취소
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-text-subtle">-</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      ) : (
        <UserHistoryEmpty />
      )}
      </UserHistoryCard>
    </div>
  );
}

function RecentEstimates({
  history,
}: {
  history: AdminMoverDetail["estimateActivity"]["recent"];
}) {
  return (
    <UserHistoryCard title="최근 견적 활동" totalCount={history.totalCount}>
      {history.items.length ? (
        <div>
          <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,0.9fr)] gap-3 border-b border-border bg-background-muted px-5 py-3 text-xs font-semibold text-muted">
              <span>이사 정보</span>
              <span>대상 고객</span>
              <span>상태</span>
              <span>견적가</span>
            </div>
            <div className="divide-y divide-border">
              {history.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,0.9fr)] items-center gap-3 px-5 py-4"
                >
                  <Text
                    as="div"
                    variant="md-medium"
                    className="flex flex-col gap-1 text-foreground"
                  >
                    <span className="font-semibold">
                      {formatKoreanDate(item.moveDate)}
                    </span>
                    <span>{moveTypeLabel[item.moveType]}</span>
                  </Text>
                  <Link
                    href={`${APP_ROUTES.CUSTOMERS}/${item.customer.id}`}
                    className="truncate text-sm font-medium text-foreground underline underline-offset-2 hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    title={`${item.customer.name} 고객 상세 보기`}
                  >
                    {item.customer.name}
                  </Link>
                  <div className="flex min-w-0 flex-col items-start gap-1">
                    <span
                      className={cn(
                        statusBadgeClass,
                        recentStatusClass[item.status],
                      )}
                    >
                      {recentStatusLabel[item.status]}
                    </span>
                    <Text
                      as="p"
                      variant="xs-medium"
                      className="text-text-secondary"
                    >
                      {getRecentStatusDate(item)}
                    </Text>
                  </div>
                  <Text as="p" variant="md-semibold" className="text-foreground">
                    {item.price.toLocaleString("ko-KR")}원
                  </Text>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <UserHistoryEmpty />
      )}
    </UserHistoryCard>
  );
}

export default function MoverEstimateActivity({
  activity,
  moverId,
  moverName,
  moverNickname,
  onCancelConfirmedEstimate,
}: MoverEstimateActivityProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <InProgressEstimates
        history={activity.inProgress}
        moverId={moverId}
        moverName={moverName}
        moverNickname={moverNickname}
        onCancelConfirmedEstimate={onCancelConfirmedEstimate}
      />
      <RecentEstimates history={activity.recent} />
    </div>
  );
}
