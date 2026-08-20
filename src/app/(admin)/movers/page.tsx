import AdminMoversPage from "@/components/admin/movers/AdminMoversPage";
import { Suspense } from "react";

export default function MoversPage() {
  return (
    <Suspense fallback={null}>
      <AdminMoversPage />
    </Suspense>
  );
}
