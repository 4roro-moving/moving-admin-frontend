import CustomerEstimateRequests from "@/components/admin/customers/CustomerEstimateRequests";
import CustomerReportHistory from "@/components/admin/customers/CustomerReportHistory";
import CustomerReviewHistory from "@/components/admin/customers/CustomerReviewHistory";
import CustomerSuspensionHistory from "@/components/admin/customers/CustomerSuspensionHistory";
import type { AdminEstimateCancellationTarget } from "@/types/adminEstimate";
import type { AdminCustomerDetail } from "@/types/adminCustomerDetail";

interface CustomerDetailHistoriesProps {
  customer: AdminCustomerDetail;
  onCancelConfirmedEstimate: (target: AdminEstimateCancellationTarget) => void;
  onReportDetail: (id: number) => void;
}

export default function CustomerDetailHistories({
  customer,
  onCancelConfirmedEstimate,
  onReportDetail,
}: CustomerDetailHistoriesProps) {
  return (
    <>
      <CustomerEstimateRequests
        customerName={customer.account.name}
        history={customer.estimateRequests}
        onCancelConfirmedEstimate={onCancelConfirmedEstimate}
      />
      <CustomerReviewHistory history={customer.reviewHistory} />
      <CustomerReportHistory
        history={customer.reportHistory}
        onDetail={onReportDetail}
      />
      <CustomerSuspensionHistory history={customer.suspensionHistory} />
    </>
  );
}
