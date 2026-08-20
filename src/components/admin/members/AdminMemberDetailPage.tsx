"use client";

import { useRouter } from "next/navigation";

import Text from "@/components/admin/common/Text";

export default function AdminMemberDetailPage() {
  const router = useRouter();

  return (
    <section className="flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/customers")}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary hover:bg-background-hover"
        >
          목록으로
        </button>
        <div>
          <Text as="p" variant="md-medium" className="text-muted">
            Customer
          </Text>
          <Text as="h1" variant="2xl-semibold" className="text-foreground">
            고객 상세
          </Text>
        </div>
      </div>
      <div className="rounded-20 border border-border bg-surface p-6 shadow-select">
        <Text as="p" variant="md-regular" className="text-muted">
          고객 상세 조회 API 연동 화면입니다.
        </Text>
      </div>
    </section>
  );
}
