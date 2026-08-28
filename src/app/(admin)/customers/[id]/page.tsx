import AdminCustomerDetailPage from "@/components/admin/customers/AdminCustomerDetailPage";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminCustomerDetailPage customerId={id} />;
}
