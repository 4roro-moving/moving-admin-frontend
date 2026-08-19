import type { Pagination } from "@/types/pagination";
import Text from "@/components/admin/common/Text";

interface AdminListPaginationProps {
  pagination: Pagination;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function AdminListPagination({
  pagination,
  isPreviousDisabled,
  isNextDisabled,
  onPrevious,
  onNext,
}: AdminListPaginationProps) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4 text-sm text-muted">
      <Text as="span" variant="md-regular" className="whitespace-nowrap text-muted">
        {pagination.page} / {pagination.totalPages} 페이지
      </Text>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          className="rounded-lg border border-border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Text as="span" variant="sm-medium">이전</Text>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="rounded-lg border border-border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Text as="span" variant="sm-medium">다음</Text>
        </button>
      </div>
    </div>
  );
}
