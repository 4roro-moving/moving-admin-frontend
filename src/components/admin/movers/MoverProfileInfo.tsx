/* eslint-disable @next/next/no-img-element */

import Text from "@/components/admin/common/Text";
import { StarIcon } from "@/icons";
import type { AdminMoverDetail } from "@/types/adminMoverDetail";

const moveTypeLabel = {
  SMALL: "소형 이사",
  HOME: "가정 이사",
  OFFICE: "사무실 이사",
} as const;

interface ItemProps {
  label: string;
  value: string;
}

interface MoverProfileInfoProps {
  account: AdminMoverDetail["account"];
  profile: AdminMoverDetail["profile"];
}

function Item({ label, value }: ItemProps) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-border py-3 last:border-b-0">
      <Text as="dt" variant="md-medium" className="text-muted">
        {label}
      </Text>
      <Text as="dd" variant="md-regular" className="min-w-0 text-foreground">
        {value}
      </Text>
    </div>
  );
}

export default function MoverProfileInfo({
  account,
  profile,
}: MoverProfileInfoProps) {
  return (
    <section className="rounded-20 border border-border bg-surface p-5 shadow-select">
      <Text as="h2" variant="lg-semibold" className="text-foreground">
        프로필 정보
      </Text>
      <div className="my-5 flex items-center gap-4">
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt={`${profile.nickname} 프로필`}
            className="size-16 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-accent-muted text-xl font-semibold text-accent">
            {profile.nickname?.slice(0, 1) ?? account.name.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0">
          <Text as="p" variant="lg-semibold" className="text-foreground">
            {profile.nickname}
          </Text>
          <Text as="p" variant="sm-medium" className="mt-1 text-muted">
            {account.name} · 경력 {profile.career}년
          </Text>
        </div>
      </div>
      <div className="mb-5 grid grid-cols-3 divide-x divide-border rounded-16 border border-border bg-background-muted">
        <div className="px-3 py-3 text-center">
          <Text as="p" variant="xs-regular" className="text-text-subtle">
            평균 평점
          </Text>
          <Text
            as="p"
            variant="md-semibold"
            className="mt-1 inline-flex items-center text-foreground"
          >
            <StarIcon className="mr-1 size-[1.1em] text-rating-fill" />
            {profile.averageRating.toFixed(1)}
          </Text>
        </div>
        <div className="px-3 py-3 text-center">
          <Text as="p" variant="xs-regular" className="text-text-subtle">
            리뷰
          </Text>
          <Text as="p" variant="md-semibold" className="mt-1 text-foreground">
            {profile.reviewCount}건
          </Text>
        </div>
        <div className="px-3 py-3 text-center">
          <Text as="p" variant="xs-regular" className="text-text-subtle">
            확정 거래
          </Text>
          <Text as="p" variant="md-semibold" className="mt-1 text-foreground">
            {profile.confirmedCount}건
          </Text>
        </div>
      </div>
      <dl>
        <Item label="한줄 소개" value={profile.shortIntro} />
        <Item label="상세 소개" value={profile.description} />
        <Item label="서비스 지역" value={profile.serviceAreas.join(", ")} />
        <Item
          label="이사 유형"
          value={profile.serviceTypes.map((type) => moveTypeLabel[type]).join(", ")}
        />
      </dl>
    </section>
  );
}
