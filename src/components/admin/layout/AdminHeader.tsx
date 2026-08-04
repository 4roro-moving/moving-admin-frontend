export default function AdminHeader() {
  return (
    <header className="bg-surface border-border flex items-center justify-between border-b px-6 py-4">
      <div>
        <p className="text-muted text-xs font-medium tracking-[0.2em]">MOVING ADMIN</p>
        <h1 className="text-lg font-semibold">관리자 영역</h1>
      </div>

      <button
        type="button"
        disabled
        className="border-border text-muted rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-80"
      >
        로그아웃 예정
      </button>
    </header>
  );
}
