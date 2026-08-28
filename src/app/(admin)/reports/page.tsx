import { Suspense } from "react";

import AdminReportsPage from "@/components/admin/reports/AdminReportsPage";

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <section className="space-y-4">
          <div>
            <p className="text-muted text-sm font-medium">Reports</p>
            <h1 className="text-3xl font-semibold">신고 관리</h1>
          </div>
          <div className="bg-surface border-border rounded-2xl border p-6">
            <p className="text-muted text-sm">신고 관리 화면을 불러오는 중입니다.</p>
          </div>
        </section>
      }
    >
      <AdminReportsPage />
    </Suspense>
  );
}
