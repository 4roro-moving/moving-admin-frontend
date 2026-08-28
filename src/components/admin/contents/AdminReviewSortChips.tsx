import { ADMIN_REVIEW_SORT_OPTIONS } from "@/lib/constants/adminReviews";
import { cn } from "@/lib/utils/cn";
import type { AdminReviewSort } from "@/types/adminReview";

interface AdminContentSortOption<T extends string> {
  value: T;
  label: string;
}

interface AdminReviewSortChipsProps<T extends string = AdminReviewSort> {
  value: T;
  onChange: (sort: T) => void;
  options?: Array<AdminContentSortOption<T>>;
}

export default function AdminReviewSortChips<T extends string = AdminReviewSort>({
  value,
  onChange,
  options,
}: AdminReviewSortChipsProps<T>) {
  const sortOptions = (options ??
    ADMIN_REVIEW_SORT_OPTIONS) as Array<AdminContentSortOption<T>>;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {sortOptions.map((option) => {
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
