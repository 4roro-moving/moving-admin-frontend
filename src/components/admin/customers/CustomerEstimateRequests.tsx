import Text from "@/components/admin/common/Text";
import CustomerHistoryCard, {
  CustomerHistoryEmpty,
} from "@/components/admin/customers/CustomerHistoryCard";
import {
  formatCustomerDetailDate,
  formatCustomerDetailDateTime,
} from "@/lib/utils/adminCustomerDetail";
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
  PENDING: "bg-slate-100 text-slate-600",
  OPEN: "bg-orange-50 text-orange-700",
  CONFIRMED: "bg-violet-50 text-violet-700",
  CANCELED: "bg-rose-50 text-rose-700",
  EXPIRED: "bg-slate-100 text-slate-600",
  COMPLETED: "bg-emerald-50 text-emerald-700",
} as const;

export default function CustomerEstimateRequests({
  history,
}: {
  history: AdminCustomerDetail["estimateRequests"];
}) {
  return (
    <CustomerHistoryCard title="견적 요청 이력" totalCount={history.totalCount}>
      {history.items.length === 0 ? (
        <CustomerHistoryEmpty />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1120px]">
            <div className="grid grid-cols-[8rem_8rem_8rem_8rem_minmax(18rem,1fr)_11rem_8rem] gap-4 border-b border-border bg-background-muted px-5 py-3 text-xs font-semibold text-muted">
              <span>이사 예정일</span>
              <span>이사 유형</span>
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
                    className="grid grid-cols-[8rem_8rem_8rem_8rem_minmax(18rem,1fr)_11rem_8rem] gap-4 px-5 py-4"
                  >
                    <Text
                      as="p"
                      variant="md-semibold"
                      className="text-foreground"
                    >
                      {formatCustomerDetailDate(item.moveDate)}
                    </Text>
                    <Text
                      as="p"
                      variant="md-medium"
                      className="text-foreground"
                    >
                      {moveTypeLabel[item.moveType]}
                    </Text>
                    <Text
                      as="p"
                      variant="md-medium"
                      className="text-foreground"
                    >
                      {formatCustomerDetailDate(item.createdAt)}
                    </Text>
                    <div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${estimateStatusClass[item.status]}`}
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
                          {formatCustomerDetailDateTime(time)} {label}
                        </Text>
                      ) : (
                        <span className="text-sm text-text-subtle">-</span>
                      )}
                    </div>
                    {item.confirmedEstimate?.cancelable ? (
                      <div className="flex flex-col items-start gap-1">
                        <button
                          type="button"
                          disabled
                          aria-describedby={`estimate-cancel-pending-${item.id}`}
                          className="cursor-not-allowed rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-text-subtle opacity-60"
                        >
                          확정 견적 취소
                        </button>
                        <span
                          id={`estimate-cancel-pending-${item.id}`}
                          className="text-xs text-text-subtle"
                        >
                          준비 중
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-text-subtle">-</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </CustomerHistoryCard>
  );
}
