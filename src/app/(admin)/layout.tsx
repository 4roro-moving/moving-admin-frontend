import type { ReactNode } from "react";

import AdminRouteGuard from "@/components/admin/auth/AdminRouteGuard";
import AdminShell from "@/components/admin/layout/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminRouteGuard>
      <AdminShell>{children}</AdminShell>
    </AdminRouteGuard>
  );
}
