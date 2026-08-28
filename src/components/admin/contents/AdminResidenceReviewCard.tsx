import { formatReviewDate, renderStars } from "@/lib/utils/adminReview";
import { cn } from "@/lib/utils/cn";
import type { AdminResidenceReviewItem } from "@/types/adminResidenceReview";

interface AdminResidenceReviewCardProps {
  review: AdminResidenceReviewItem;
  disabled: boolean;
  onHide: (review: AdminResidenceReviewItem) => void;
  onUnhide: (review: AdminResidenceReviewItem) => void;
}

export default function AdminResidenceReviewCard({
  review,
  disabled,
  onHide,
  onUnhide,
}: AdminResidenceReviewCardProps) {
  const isHidden = review.isHidden;
  const actionLabel = isHidden ? "복구" : "숨김";

  return (
    <article className="border-border bg-surface rounded-2xl border px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-foreground">{review.author.name}</p>
            <p className="text-muted text-sm">{formatReviewDate(review.createdAt)}</p>
            <p className="text-sm text-amber-500">{renderStars(review.rating)}</p>

            {review.reportCount > 0 ? (
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                신고 {review.reportCount}
              </span>
            ) : null}

            {isHidden ? (
              <span className="bg-accent-muted text-accent rounded-md px-2 py-0.5 text-xs font-semibold">
                숨김
              </span>
            ) : null}
          </div>

          <p className="text-muted text-xs">{review.region.name}</p>

          <p className="text-sm font-semibold text-foreground">{review.title}</p>

          <p
            className={cn(
              "text-sm leading-relaxed",
              isHidden ? "text-muted" : "text-foreground/80",
            )}
          >
            {review.content}
          </p>

          {review.latestModeration?.reason ? (
            <div className="bg-background mt-1 rounded-lg px-3 py-2">
              <p className="text-muted text-xs font-semibold">
                {review.latestModeration.action === "HIDE"
                  ? "관리자 숨김 사유"
                  : "관리자 복구 사유"}
              </p>
              <p className="mt-1 text-sm text-foreground/80">{review.latestModeration.reason}</p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className={cn(
            "shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40",
            isHidden
              ? "border-transparent bg-accent text-white"
              : "border-red-200 bg-surface text-red-600",
          )}
          disabled={disabled}
          onClick={() => {
            if (isHidden) {
              onUnhide(review);
              return;
            }
            onHide(review);
          }}
        >
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
