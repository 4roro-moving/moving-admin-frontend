import CustomerEstimateRequests from "@/components/admin/customers/CustomerEstimateRequests";
import CustomerReportHistory from "@/components/admin/customers/CustomerReportHistory";
import CustomerReviewHistory from "@/components/admin/customers/CustomerReviewHistory";
import CustomerSuspensionHistory from "@/components/admin/customers/CustomerSuspensionHistory";
import type { AdminCustomerDetail } from "@/types/adminCustomerDetail";

interface CustomerDetailHistoriesProps {
  customer: AdminCustomerDetail;
  onReportDetail: (id: number) => void;
}

export default function CustomerDetailHistories({
  customer,
  onReportDetail,
}: CustomerDetailHistoriesProps) {
  return (
    <>
      <CustomerEstimateRequests history={customer.estimateRequests} />
      <CustomerReviewHistory history={customer.reviewHistory} />
      <CustomerReportHistory
        history={customer.reportHistory}
        onDetail={onReportDetail}
      />
      <CustomerSuspensionHistory history={customer.suspensionHistory} />
    </>
  );
}
