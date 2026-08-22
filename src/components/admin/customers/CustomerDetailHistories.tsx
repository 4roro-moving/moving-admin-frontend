import CustomerEstimateRequests from "@/components/admin/customers/CustomerEstimateRequests";
import CustomerReportHistory from "@/components/admin/customers/CustomerReportHistory";
import CustomerReviewHistory from "@/components/admin/customers/CustomerReviewHistory";
import UserInquiryHistory from "@/components/admin/users/UserInquiryHistory";
import UserSuspensionHistory from "@/components/admin/users/UserSuspensionHistory";
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
          customerId={customer.account.id}
          customerName={customer.account.name}
        history={customer.estimateRequests}
        onCancelConfirmedEstimate={onCancelConfirmedEstimate}
      />
      <CustomerReviewHistory history={customer.reviewHistory} />
      <UserInquiryHistory history={customer.inquiryHistory} />
      <CustomerReportHistory
        history={customer.reportHistory}
        onDetail={onReportDetail}
      />
      <UserSuspensionHistory history={customer.suspensionHistory} />
    </>
  );
}
