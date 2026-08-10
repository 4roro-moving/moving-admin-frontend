import { ADMIN_REVIEW_SORT_OPTIONS } from "@/lib/constants/adminReviews";
import { cn } from "@/lib/utils/cn";
import type { AdminReviewSort } from "@/types/adminReview";

interface AdminReviewSortChipsProps {
  value: AdminReviewSort;
  onChange: (sort: AdminReviewSort) => void;
}

export default function AdminReviewSortChips({ value, onChange }: AdminReviewSortChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ADMIN_REVIEW_SORT_OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm",
              isActive
                ? "border-accent bg-accent-muted text-accent font-semibold"
                : "border-border bg-surface text-muted font-medium",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
