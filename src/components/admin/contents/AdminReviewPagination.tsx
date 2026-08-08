import { getVisiblePages } from "@/lib/utils/adminReview";
import { cn } from "@/lib/utils/cn";
import type { Pagination } from "@/types/pagination";

interface AdminReviewPaginationProps {
  pagination: Pagination;
  onChangePage: (page: number) => void;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function AdminReviewPagination({
  pagination,
  onChangePage,
}: AdminReviewPaginationProps) {
  const totalPages = Math.max(1, pagination.totalPages);
  const visiblePages = getVisiblePages(pagination.page, totalPages);

  const goToPage = (page: number) => {
    onChangePage(page);
    scrollToTop();
  };

  return (
    <nav aria-label="리뷰 목록 페이지" className="flex items-center justify-center gap-1 pt-2">
      <button
        type="button"
        className="border-border text-muted rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
        disabled={pagination.page <= 1}
        onClick={() => goToPage(pagination.page - 1)}
      >
        이전
      </button>
      {visiblePages.map((pageNumber, index) => {
        const previous = visiblePages[index - 1];
        const showEllipsis = previous !== undefined && pageNumber - previous > 1;

        return (
          <span key={pageNumber} className="flex items-center gap-1">
            {showEllipsis ? <span className="text-muted px-1 text-sm">…</span> : null}
            <button
              type="button"
              aria-current={pageNumber === pagination.page ? "page" : undefined}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                pageNumber === pagination.page
                  ? "border-accent bg-accent text-white"
                  : "border-border text-muted bg-surface",
              )}
              onClick={() => goToPage(pageNumber)}
            >
              {pageNumber}
            </button>
          </span>
        );
      })}
      <button
        type="button"
        className="border-border text-muted rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
        disabled={pagination.page >= totalPages}
        onClick={() => goToPage(pagination.page + 1)}
      >
        다음
      </button>
    </nav>
  );
}
