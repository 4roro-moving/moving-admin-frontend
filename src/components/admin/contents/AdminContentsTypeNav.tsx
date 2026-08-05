"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <aside className="border-border bg-surface hidden w-60 shrink-0 border-r px-5 py-8 lg:block">
      <p className="text-muted text-sm font-semibold">콘텐츠 유형</p>
      <nav aria-label="콘텐츠 유형" className="mt-2 flex flex-col gap-2">
        {CONTENTS_TYPE_ITEMS.map((item) => {
          const isActive = item.href !== undefined && pathname === item.href;

          if (!item.href) {
            return (
              <div key={item.label} className="rounded-xl px-4 py-3">
                <span className="text-base font-medium text-foreground">{item.label}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
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
    </aside>
  );
}
