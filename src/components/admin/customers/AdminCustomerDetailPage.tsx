"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CustomerAccountInfo from "@/components/admin/customers/CustomerAccountInfo";
import CustomerDetailHeader from "@/components/admin/customers/CustomerDetailHeader";
import CustomerDetailHistories from "@/components/admin/customers/CustomerDetailHistories";
import CustomerProfileInfo from "@/components/admin/customers/CustomerProfileInfo";
import CustomerStatusAction from "@/components/admin/customers/CustomerStatusAction";
import { ADMIN_CUSTOMER_DETAIL_MOCK } from "@/mocks/adminCustomerDetailMock";

export default function AdminCustomerDetailPage() {
  const router = useRouter();
  const customer = ADMIN_CUSTOMER_DETAIL_MOCK;
  const { account, profile } = customer;
  const [accountStatus, setAccountStatus] = useState(account.status);

  return (
    <section className="flex w-full flex-col gap-6">
      <CustomerDetailHeader
        name={account.name}
        status={accountStatus}
        onBack={() => router.push("/customers")}
        action={
          <CustomerStatusAction
            status={accountStatus}
            onToggle={() =>
              setAccountStatus((status) =>
                status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED",
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
