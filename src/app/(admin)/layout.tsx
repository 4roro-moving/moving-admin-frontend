import type { ReactNode } from "react";

import AdminShell from "@/components/admin/layout/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // TODO: Refresh Cookie 기반 세션 복구 후 ADMIN 역할을 검증합니다.
  // TODO: 비로그인 또는 비ADMIN 사용자는 일반 서비스 로그인으로 이동시킵니다.
  return <AdminShell>{children}</AdminShell>;
}
