import AdminMemberDetailPage from "@/components/admin/members/AdminMemberDetailPage";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return <AdminMemberDetailPage />;
}
