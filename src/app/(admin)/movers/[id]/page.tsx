import AdminMoverDetailPage from "@/components/admin/movers/AdminMoverDetailPage";

export default async function MoverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminMoverDetailPage moverId={id} />;
}
