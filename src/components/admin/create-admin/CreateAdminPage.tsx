"use client";

import AdminFeedbackToast from "@/components/admin/common/AdminFeedbackToast";
import Text from "@/components/admin/common/Text";
import { useAdminFeedbackToast } from "@/hooks/common/useAdminFeedbackToast";

import CreateAdminForm from "./CreateAdminForm";

export default function CreateAdminPage() {
  const [successMessage, showFeedback] = useAdminFeedbackToast<string>();

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
            showFeedback("관리자 계정을 생성했습니다.");
          }}
        />
      </section>

      {successMessage ? (
        <AdminFeedbackToast tone="success" message={successMessage} />
      ) : null}
    </>
  );
}
