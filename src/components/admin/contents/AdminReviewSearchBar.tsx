interface AdminReviewSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputId?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function AdminReviewSearchBar({
  value,
  onChange,
  onSubmit,
  inputId = "admin-review-search",
  label = "작성자 또는 키워드 검색",
  placeholder = "작성자 또는 키워드 검색",
  className = "w-full max-w-md",
}: AdminReviewSearchBarProps) {
  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="border-border bg-surface text-foreground placeholder:text-muted focus:border-accent w-full rounded-xl border px-4 py-3 text-sm outline-none"
      />
    </form>
  );
}
