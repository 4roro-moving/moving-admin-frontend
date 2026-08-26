"use client";

import { useEffect, useState } from "react";

import AdminFeedbackToast from "@/components/admin/common/AdminFeedbackToast";
import Text from "@/components/admin/common/Text";

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
    <>
      <section className="flex flex-col gap-5">
        <header className="flex flex-col gap-2">
          <Text as="h1" variant="pageTitle" className="text-text-primary">
            관리자 계정 생성
          </Text>
          <Text as="p" variant="md-regular" className="text-muted">
            일반 관리자 계정을 생성합니다. 슈퍼 관리자만 사용할 수 있습니다.
          </Text>
        </header>

        <CreateAdminForm
          onCreated={() => {
            setSuccessMessage("관리자 계정을 생성했습니다.");
          }}
        />
      </section>

      {successMessage ? (
        <AdminFeedbackToast tone="success" message={successMessage} />
      ) : null}
    </>
  );
}
