import Text from "@/components/admin/common/Text";
import CustomerHistoryCard, {
  CustomerHistoryEmpty,
} from "@/components/admin/customers/CustomerHistoryCard";
import { StarIcon } from "@/icons";
import { formatCustomerDetailDate } from "@/lib/utils/adminCustomerDetail";
import type { AdminCustomerDetail } from "@/types/adminCustomerDetail";

export default function CustomerReviewHistory({
  history,
}: {
  history: AdminCustomerDetail["reviewHistory"];
}) {
  return (
    <CustomerHistoryCard title="작성 리뷰 이력" totalCount={history.totalCount}>
      {history.items.length ? (
        <div className="divide-y divide-border">
          {history.items.map((item) => (
            <article key={item.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Text
                    as="p"
                    variant="md-semibold"
                    className="text-foreground"
                  >
                    {item.moverNickname}
                  </Text>
                  <span className="inline-flex items-center text-sm text-text-secondary">
                    <StarIcon className="mr-1 size-[1.1em] text-rating-fill" />
                    {item.rating}점
                  </span>
                  <span
                    className={
                      item.isHidden
                        ? "rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700"
                        : "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"
                    }
                  >
                    {item.isHidden ? "숨김" : "공개"}
                  </span>
                </div>
                <Text
                  as="span"
                  variant="xs-medium"
                  className="text-text-subtle"
                >
                  {formatCustomerDetailDate(item.createdAt)}
                </Text>
              </div>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {item.content}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <CustomerHistoryEmpty />
      )}
    </CustomerHistoryCard>
  );
}
