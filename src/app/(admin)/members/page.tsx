import AdminMembersPage from "@/components/admin/members/AdminMembersPage";
import { Suspense } from "react";

export default function MembersPage() {
  return (
    <Suspense fallback={null}>
      <AdminMembersPage />
    </Suspense>
  );
}
