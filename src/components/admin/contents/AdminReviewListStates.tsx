import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

interface AdminReviewLoadingStateProps {
  message?: string;
}

export function AdminReviewLoadingState({
  message = "리뷰 목록을 불러오는 중입니다.",
}: AdminReviewLoadingStateProps) {
  return (
    <div className="border-border bg-surface rounded-2xl border px-5 py-6">
      <p className="text-muted text-sm">{message}</p>
    </div>
  );
}

interface AdminReviewErrorStateProps {
  error: unknown;
  onRetry: () => void;
  message?: string;
}

export function AdminReviewErrorState({
  error,
  onRetry,
  message = "리뷰 목록을 불러오지 못했습니다.",
}: AdminReviewErrorStateProps) {
  return (
    <div className="border-border bg-surface rounded-2xl border px-5 py-4">
      <p className="text-sm text-red-600">{getApiErrorMessage(error, message)}</p>
      <button
        type="button"
        className="border-border mt-3 rounded-lg border px-3 py-2 text-sm"
        onClick={onRetry}
      >
        다시 시도
      </button>
    </div>
  );
}

interface AdminReviewEmptyStateProps {
  message?: string;
}

export function AdminReviewEmptyState({
  message = "조건에 맞는 리뷰가 없습니다.",
}: AdminReviewEmptyStateProps) {
  return (
    <div className="border-border bg-surface rounded-2xl border px-5 py-10 text-center">
      <p className="text-muted text-sm">{message}</p>
    </div>
  );
}
