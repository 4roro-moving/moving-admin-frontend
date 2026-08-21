import type { ReactNode } from "react";

import Text from "@/components/admin/common/Text";

interface CustomerHistoryCardProps {
  title: string;
  totalCount: number;
  children: ReactNode;
}

export function CustomerHistoryEmpty() {
  return (
    <p className="px-5 py-10 text-center text-sm text-muted">
      최근 이력이 없습니다.
    </p>
  );
}

export default function CustomerHistoryCard({
  title,
  totalCount,
  children,
}: CustomerHistoryCardProps) {
  return (
    <section className="overflow-hidden rounded-20 border border-border bg-surface shadow-select">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <Text as="h2" variant="lg-semibold" className="text-foreground">
          {title}
        </Text>
        <Text as="span" variant="sm-medium" className="text-muted">
          총 {totalCount}건 · 최근 5건
        </Text>
      </header>
      {children}
    </section>
  );
}
