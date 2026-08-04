export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-muted text-sm font-medium">Dashboard</p>
        <h1 className="text-3xl font-semibold">관리자 대시보드</h1>
      </div>
      <div className="bg-surface border-border rounded-2xl border p-6">
        <p className="text-muted text-sm">
          관리자 대시보드 실제 지표와 위젯은 후속 작업에서 연결합니다.
        </p>
      </div>
    </section>
  );
}
