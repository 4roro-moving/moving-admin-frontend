import AdminCustomerDetailPage from "@/components/admin/customers/AdminCustomerDetailPage";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return <AdminCustomerDetailPage />;
}
