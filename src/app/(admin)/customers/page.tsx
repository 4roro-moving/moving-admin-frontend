import AdminMembersPage from "@/components/admin/members/AdminMembersPage";
import { Suspense } from "react";

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <AdminMembersPage />
    </Suspense>
  );
}
