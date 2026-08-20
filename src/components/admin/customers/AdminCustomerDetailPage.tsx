"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CustomerAccountInfo from "@/components/admin/customers/CustomerAccountInfo";
import CustomerDetailHeader from "@/components/admin/customers/CustomerDetailHeader";
import CustomerDetailHistories from "@/components/admin/customers/CustomerDetailHistories";
import CustomerProfileInfo from "@/components/admin/customers/CustomerProfileInfo";
import CustomerStatusAction from "@/components/admin/customers/CustomerStatusAction";
import AccountRestrictionModal from "@/components/admin/users/AccountRestrictionModal";
import { useAdminCustomerDetail } from "@/hooks/useAdminCustomerDetail";
import { useAdminCustomerStatusMutation } from "@/hooks/useAdminCustomerStatusMutation";
import type { RestrictionFormInput } from "@/hooks/useAccountRestrictionForm";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

interface AdminCustomerDetailPageProps {
  customerId: string;
}

export default function AdminCustomerDetailPage({ customerId }: AdminCustomerDetailPageProps) {
  const router = useRouter();
  const { data: customer, error, isError, isLoading, refetch } =
    useAdminCustomerDetail(customerId);
  const customerStatusMutation = useAdminCustomerStatusMutation();
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [customerId]);

  if (isLoading) {
    return <section className="flex w-full flex-col items-center justify-center py-24"><p className="text-sm text-muted">고객 상세 정보를 불러오는 중입니다.</p></section>;
  }

  if (isError || !customer) {
    return <section className="flex w-full flex-col items-center justify-center py-24"><p className="text-sm text-rose-600">{getApiErrorMessage(error, "고객 상세 정보를 불러오지 못했습니다.")}</p><button type="button" onClick={() => void refetch()} className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-background-hover">다시 시도</button></section>;
  }

  const { account, profile } = customer;

  const handleRestrictionSubmit = async (input: RestrictionFormInput) => {
    try {
      await customerStatusMutation.mutateAsync({
        customerId,
        payload: input,
      });
      setIsRestrictionModalOpen(false);
    } catch {
      // 오류는 모달 내부에서 안내한다.
    }
  };

  return (
    <section className="flex w-full flex-col gap-6">
      <CustomerDetailHeader
        name={account.name}
        status={account.status}
        onBack={() => router.back()}
        action={
          <CustomerStatusAction
            status={account.status}
            onClick={() => setIsRestrictionModalOpen(true)}
          />
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.85fr)]">
        <CustomerAccountInfo account={account} />
        <CustomerProfileInfo account={account} profile={profile} />
      </div>
      <CustomerDetailHistories
        customer={customer}
        onReportDetail={(reportId) =>
          router.push(`/reports?reportId=${reportId}`)
        }
      />
      {isRestrictionModalOpen ? (
        <AccountRestrictionModal
          error={
            customerStatusMutation.isError ? customerStatusMutation.error : undefined
          }
          initialAction={account.status === "SUSPENDED" ? "RELEASE" : "SUSPEND"}
          isPending={customerStatusMutation.isPending}
          open={isRestrictionModalOpen}
          onClose={() => setIsRestrictionModalOpen(false)}
          onSubmit={handleRestrictionSubmit}
        />
      ) : null}
    </section>
  );
}
