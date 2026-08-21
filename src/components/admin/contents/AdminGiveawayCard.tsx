import { ADMIN_GIVEAWAY_STATUS_LABEL } from "@/lib/constants/adminGiveaways";
import { formatReviewDate } from "@/lib/utils/adminReview";
import { cn } from "@/lib/utils/cn";
import type { AdminGiveawayItem } from "@/types/adminGiveaway";

interface AdminGiveawayCardProps {
  giveaway: AdminGiveawayItem;
  disabled: boolean;
  onHide: (giveaway: AdminGiveawayItem) => void;
  onUnhide: (giveaway: AdminGiveawayItem) => void;
}

export default function AdminGiveawayCard({
  giveaway,
  disabled,
  onHide,
  onUnhide,
}: AdminGiveawayCardProps) {
  const isHidden = giveaway.isHidden;
  const actionLabel = isHidden ? "복구" : "숨김";

  return (
    <article className="border-border bg-surface rounded-2xl border px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-foreground">{giveaway.author.name}</p>
            <p className="text-muted text-sm">{formatReviewDate(giveaway.createdAt)}</p>
            <span className="bg-background text-muted rounded-md px-2 py-0.5 text-xs font-semibold">
              {ADMIN_GIVEAWAY_STATUS_LABEL[giveaway.status]}
            </span>

            {giveaway.reportCount > 0 ? (
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                신고 {giveaway.reportCount}
              </span>
            ) : null}

            {isHidden ? (
              <span className="bg-accent-muted text-accent rounded-md px-2 py-0.5 text-xs font-semibold">
                숨김
              </span>
            ) : null}
          </div>

          <p className="text-muted text-xs">{giveaway.region?.name ?? "지역 미지정"}</p>

          <p className="text-sm font-semibold text-foreground">{giveaway.title}</p>

          <p
            className={cn(
              "text-sm leading-relaxed",
              isHidden ? "text-muted" : "text-foreground/80",
            )}
          >
            {giveaway.description}
          </p>

          {giveaway.latestModeration?.reason ? (
            <div className="bg-background mt-1 rounded-lg px-3 py-2">
              <p className="text-muted text-xs font-semibold">
                {giveaway.latestModeration.action === "HIDE"
                  ? "관리자 숨김 사유"
                  : "관리자 복구 사유"}
              </p>
              <p className="mt-1 text-sm text-foreground/80">{giveaway.latestModeration.reason}</p>
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
              onUnhide(giveaway);
              return;
            }
            onHide(giveaway);
          }}
        >
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
