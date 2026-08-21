import Text from "@/components/admin/common/Text";
import CustomerHistoryCard, {
  CustomerHistoryEmpty,
} from "@/components/admin/customers/CustomerHistoryCard";
import {
  formatKoreanDate,
  formatKoreanDateTime,
} from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { AdminEstimateCancellationTarget } from "@/types/adminEstimate";
import type { AdminCustomerDetail } from "@/types/adminCustomerDetail";

const moveTypeLabel = {
  SMALL: "소형 이사",
  HOME: "가정 이사",
  OFFICE: "사무실 이사",
} as const;

const estimateStatusLabel = {
  PENDING: "작성 중",
  OPEN: "견적 요청 진행 중",
  CONFIRMED: "거래 확정",
  CANCELED: "요청 취소",
  EXPIRED: "요청 만료",
  COMPLETED: "이사 완료",
} as const;

const estimateStatusClass = {
  PENDING: "bg-status-neutral-background text-status-neutral-foreground",
  OPEN: "bg-status-progress-background text-status-progress-foreground",
  CONFIRMED: "bg-status-confirmed-background text-status-confirmed-foreground",
  CANCELED: "bg-status-suspended-background text-status-suspended-foreground",
  EXPIRED: "bg-status-neutral-background text-status-neutral-foreground",
  COMPLETED: "bg-status-active-background text-status-active-foreground",
} as const;

const statusBadgeClass = "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold";

interface CustomerEstimateRequestsProps {
  customerName: string;
  history: AdminCustomerDetail["estimateRequests"];
  onCancelConfirmedEstimate: (target: AdminEstimateCancellationTarget) => void;
}

export default function CustomerEstimateRequests({
  customerName,
  history,
  onCancelConfirmedEstimate,
}: CustomerEstimateRequestsProps) {
  return (
    <div id="estimate-requests" className="scroll-mt-6">
      <CustomerHistoryCard title="견적 요청 이력" totalCount={history.totalCount}>
      {history.items.length === 0 ? (
        <CustomerHistoryEmpty />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1040px]">
            <div className="grid grid-cols-[9rem_7rem_8rem_minmax(16rem,1fr)_10rem_8rem] gap-4 border-b border-border bg-background-muted px-5 py-3 text-xs font-semibold text-muted">
              <span>이사 정보</span>
              <span>요청 등록일</span>
              <span>상태</span>
              <span>견적/확정 정보</span>
              <span>처리 일시</span>
              <span>관리</span>
            </div>
            <div className="divide-y divide-border">
              {history.items.map((item) => {
                const time =
                  item.status === "CONFIRMED"
                    ? item.confirmedEstimate?.confirmedAt
                    : item.status === "CANCELED"
                      ? item.canceledAt
                      : item.status === "EXPIRED"
                        ? item.expiredAt
                        : item.status === "COMPLETED"
                          ? item.completedAt
                          : null;
                const label =
                  item.status === "CONFIRMED"
                    ? "확정"
                    : item.status === "CANCELED"
                      ? "취소"
                      : item.status === "EXPIRED"
                        ? "만료"
                        : "완료";
                const summary =
                  item.estimateSummary.totalCount === 0
                    ? "받은 견적 없음"
                    : [
                        `견적 ${item.estimateSummary.totalCount}건`,
                        item.estimateSummary.confirmedCount > 0
                          ? `확정 ${item.estimateSummary.confirmedCount}건`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ");
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[9rem_7rem_8rem_minmax(16rem,1fr)_10rem_8rem] gap-4 px-5 py-4"
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
                    <Text
                      as="p"
                      variant="md-medium"
                      className="text-foreground"
                    >
                      {formatKoreanDate(item.createdAt)}
                    </Text>
                    <div>
                      <span
                        className={cn(statusBadgeClass, estimateStatusClass[item.status])}
                      >
                        {estimateStatusLabel[item.status]}
                      </span>
                    </div>
                    <div>
                      <Text
                        as="p"
                        variant="md-medium"
                        className="text-foreground"
                      >
                        {summary}
                      </Text>
                      {item.confirmedEstimate ? (
                        <Text
                          as="p"
                          variant="sm-medium"
                          className="mt-1 text-text-secondary"
                        >
                          확정 견적 정보:{" "}
                          {item.confirmedEstimate.mover.nickname}(
                          {item.confirmedEstimate.mover.name}) ·{" "}
                          {item.confirmedEstimate.price.toLocaleString("ko-KR")}
                          원
                        </Text>
                      ) : null}
                    </div>
                    <div>
                      {time ? (
                        <Text
                          as="p"
                          variant="sm-medium"
                          className="text-text-secondary"
                        >
                          {formatKoreanDateTime(time)} {label}
                        </Text>
                      ) : (
                        <span className="text-sm text-text-subtle">-</span>
                      )}
                    </div>
                    <div>
                      {item.confirmedEstimate?.cancelable ? (
                        <div className="flex items-start">
                          <button
                            type="button"
                            onClick={() => {
                              if (!item.confirmedEstimate) return;
                              onCancelConfirmedEstimate({
                                estimateId: item.confirmedEstimate.id,
                                customerName,
                                moverName: item.confirmedEstimate.mover.name,
                                moverNickname: item.confirmedEstimate.mover.nickname,
                                moveDate: item.moveDate,
                                price: item.confirmedEstimate.price,
                              });
                            }}
                            className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-background-hover"
                          >
                            확정 견적 취소
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-text-subtle">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      </CustomerHistoryCard>
    </div>
  );
}
