import AdminCustomersPage from "@/components/admin/customers/AdminCustomersPage";
import { Suspense } from "react";

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <AdminCustomersPage />
    </Suspense>
  );
}
