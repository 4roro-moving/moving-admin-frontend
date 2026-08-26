"use client";

import { useEffect, useState } from "react";

import SuperAdminRouteGuard from "@/components/admin/auth/SuperAdminRouteGuard";
import { AdminReviewFeedbackToast } from "@/components/admin/contents/AdminReviewListStates";

import CreateAdminForm from "./CreateAdminForm";

export default function CreateAdminPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 3200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [successMessage]);

  return (
    <SuperAdminRouteGuard>
      <>
        <section className="flex flex-col gap-5">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-foreground">관리자 계정 생성</h1>
            <p className="text-muted text-sm">
              일반 관리자 계정을 생성합니다. 슈퍼 관리자만 사용할 수 있습니다.
            </p>
          </header>

          <CreateAdminForm
            onCreated={() => {
              setSuccessMessage("관리자 계정을 생성했습니다.");
            }}
          />
        </section>

        {successMessage ? (
          <AdminReviewFeedbackToast tone="success" message={successMessage} />
        ) : null}
      </>
    </SuperAdminRouteGuard>
  );
}
