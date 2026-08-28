import type { Metadata } from "next";

import CreateAdminPage from "@/components/admin/create-admin/CreateAdminPage";

export const metadata: Metadata = {
  title: "관리자 계정 생성",
};

export default function CreateAdminRoutePage() {
  return <CreateAdminPage />;
}
