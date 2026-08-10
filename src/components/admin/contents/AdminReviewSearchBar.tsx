interface AdminReviewSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function AdminReviewSearchBar({
  value,
  onChange,
  onSubmit,
}: AdminReviewSearchBarProps) {
  return (
    <form
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="admin-review-search" className="sr-only">
        작성자 또는 키워드 검색
      </label>
      <input
        id="admin-review-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="작성자 또는 키워드 검색"
        className="border-border bg-surface text-foreground placeholder:text-muted focus:border-accent w-full rounded-xl border px-4 py-3 text-sm outline-none"
      />
    </form>
  );
}
