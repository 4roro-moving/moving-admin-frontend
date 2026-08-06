"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

interface ContentsTypeItem {
  label: string;
  href?: string;
}

const CONTENTS_TYPE_ITEMS: ContentsTypeItem[] = [
  { label: "리뷰", href: APP_ROUTES.CONTENTS.REVIEWS },
  { label: "거주 후기" },
  { label: "나눔 게시글" },
];

export default function AdminContentsTypeNav() {
  const pathname = usePathname();
  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null);

  return (
    <aside className="border-border bg-surface hidden w-60 shrink-0 border-r px-5 py-8 lg:block">
      <p className="text-muted text-sm font-semibold">콘텐츠 유형</p>
      <nav aria-label="콘텐츠 유형" className="mt-2 flex flex-col gap-2">
        {CONTENTS_TYPE_ITEMS.map((item) => {
          const isActive = item.href !== undefined && pathname === item.href;

          if (!item.href) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setComingSoonLabel(item.label);
                }}
                className="rounded-xl px-4 py-3 text-left text-base font-medium text-foreground/60 transition hover:bg-background"
              >
                {item.label}
                <span className="text-muted ml-2 text-xs font-normal">준비 중</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                setComingSoonLabel(null);
              }}
              className={cn(
                "rounded-xl px-4 py-3 text-base transition",
                isActive
                  ? "bg-accent-muted text-accent font-semibold"
                  : "font-medium text-foreground hover:bg-background",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {comingSoonLabel ? (
        <p role="status" className="bg-background text-muted mt-4 rounded-xl px-4 py-3 text-sm">
          {comingSoonLabel} 화면 준비중...
        </p>
      ) : null}
    </aside>
  );
}
