"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CustomerAccountInfo from "@/components/admin/customers/CustomerAccountInfo";
import CustomerDetailHeader from "@/components/admin/customers/CustomerDetailHeader";
import CustomerDetailHistories from "@/components/admin/customers/CustomerDetailHistories";
import CustomerProfileInfo from "@/components/admin/customers/CustomerProfileInfo";
import CustomerStatusAction from "@/components/admin/customers/CustomerStatusAction";
import { useAdminCustomerDetail } from "@/hooks/useAdminCustomerDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type { AdminAccountStatus } from "@/types/adminUser";

export default function AdminCustomerDetailPage({ customerId }: { customerId: string }) {
  const router = useRouter();
  const { data: customer, error, isError, isLoading, refetch } =
    useAdminCustomerDetail(customerId);
  const [accountStatus, setAccountStatus] =
    useState<AdminAccountStatus | null>(null);

  if (isLoading) {
    return <section className="flex w-full flex-col items-center justify-center py-24"><p className="text-sm text-muted">고객 상세 정보를 불러오는 중입니다.</p></section>;
  }

  if (isError || !customer) {
    return <section className="flex w-full flex-col items-center justify-center py-24"><p className="text-sm text-rose-600">{getApiErrorMessage(error, "고객 상세 정보를 불러오지 못했습니다.")}</p><button type="button" onClick={() => void refetch()} className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-background-hover">다시 시도</button></section>;
  }

  const { account, profile } = customer;
  const displayedAccountStatus = accountStatus ?? account.status;

  return (
    <section className="flex w-full flex-col gap-6">
      <CustomerDetailHeader
        name={account.name}
        status={displayedAccountStatus}
        onBack={() => router.push("/customers")}
        action={
          <CustomerStatusAction
            status={displayedAccountStatus}
            onToggle={() =>
              setAccountStatus(
                displayedAccountStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED",
              )
            }
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
    </section>
  );
}
