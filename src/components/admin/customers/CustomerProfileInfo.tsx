/* eslint-disable @next/next/no-img-element */

import Text from "@/components/admin/common/Text";
import type { AdminCustomerDetail } from "@/types/adminCustomerDetail";

const moveTypeLabel = {
  SMALL: "소형 이사",
  HOME: "가정 이사",
  OFFICE: "사무실 이사",
} as const;

interface ItemProps {
  label: string;
  value: string;
}

interface CustomerProfileInfoProps {
  account: AdminCustomerDetail["account"];
  profile: AdminCustomerDetail["profile"];
}

function Item({ label, value }: ItemProps) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-border py-3 last:border-b-0">
      <Text as="dt" variant="md-medium" className="text-muted">
        {label}
      </Text>
      <dd className="min-w-0 text-sm text-foreground">{value}</dd>
    </div>
  );
}
export default function CustomerProfileInfo({
  account,
  profile,
}: CustomerProfileInfoProps) {
  return (
    <section className="rounded-20 border border-border bg-surface p-5 shadow-select">
      <Text as="h2" variant="lg-semibold" className="text-foreground">
        프로필 정보
      </Text>
      <div className="my-5 flex items-center gap-4">
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt={`${account.name} 프로필`}
            className="size-16 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-accent-muted text-xl font-semibold text-accent">
            {account.name.slice(0, 1)}
          </div>
        )}
        <div>
          <Text as="p" variant="lg-semibold" className="text-foreground">
            {account.name}
          </Text>
          <Text as="p" variant="sm-medium" className="mt-1 text-muted">
            {account.isProfileCompleted ? "프로필 작성 완료" : "프로필 작성 전"}
          </Text>
        </div>
      </div>
      <dl>
        <Item
          label="희망 지역"
          value={
            profile.serviceAreas.length
              ? profile.serviceAreas.join(", ")
              : "미설정"
          }
        />
        <Item
          label="이사 유형"
          value={
            profile.serviceTypes.length
              ? profile.serviceTypes
                  .map((type) => moveTypeLabel[type])
                  .join(", ")
              : "미설정"
          }
        />
      </dl>
    </section>
  );
}
