export default function ReportsPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-muted text-sm font-medium">Reports</p>
        <h1 className="text-3xl font-semibold">신고 관리</h1>
      </div>
      <div className="bg-surface border-border rounded-2xl border p-6">
        <p className="text-muted text-sm">
          신고 목록, 상세 조회, 처리 플로우는 후속 작업에서 `/api/admin/*`와 연결합니다.
        </p>
      </div>
    </section>
  );
}
