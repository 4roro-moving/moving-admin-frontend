import Text from "@/components/admin/common/Text";
import UserHistoryCard, {
  UserHistoryEmpty,
} from "@/components/admin/users/UserHistoryCard";
import { StarIcon } from "@/icons";
import { formatKoreanDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { AdminMoverDetail } from "@/types/adminMoverDetail";

const visibilityClass = {
  hidden: "bg-status-suspended-background text-status-suspended-foreground",
  visible: "bg-status-active-background text-status-active-foreground",
} as const;

interface MoverReviewHistoryProps {
  history: AdminMoverDetail["reviewHistory"];
}

export default function MoverReviewHistory({ history }: MoverReviewHistoryProps) {
  return (
    <UserHistoryCard title="받은 리뷰 이력" totalCount={history.totalCount}>
      {history.items.length ? (
        <div className="divide-y divide-border">
          {history.items.map((item) => (
            <article key={item.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="inline-flex items-center text-sm text-text-secondary">
                    <StarIcon className="mr-1 size-[1.1em] text-rating-fill" />
                    {item.rating}점
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      item.isHidden ? visibilityClass.hidden : visibilityClass.visible,
                    )}
                  >
                    {item.isHidden ? "숨김" : "공개"}
                  </span>
                </div>
                <Text as="span" variant="xs-medium" className="text-text-subtle">
                  {formatKoreanDate(item.createdAt)}
                </Text>
              </div>
              <Text as="p" variant="md-regular" className="mt-3 text-text-secondary">
                {item.content}
              </Text>
            </article>
          ))}
        </div>
      ) : (
        <UserHistoryEmpty />
      )}
    </UserHistoryCard>
  );
}
