"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAVIGATION_ITEMS } from "@/lib/constants/adminNavigation";
import { cn } from "@/lib/utils/cn";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-surface hidden w-[240px] shrink-0 border-r border-[#d9d9d9] xl:flex xl:flex-col">
      <nav className="flex-1 px-5 py-8" aria-label="관리자 메뉴">
        <p className="text-muted text-sm font-bold">관리 메뉴</p>
        <ul className="mt-1 space-y-1.5">
          {ADMIN_NAVIGATION_ITEMS.map((item) => {
            const isActive = item.enabled && pathname === item.href;
            const baseClassName =
              "flex h-[43px] items-center rounded-xl px-[14px] py-3 text-[13px] leading-none transition";

            if (!item.enabled) {
              return (
                <li key={item.label}>
                  <div
                    aria-disabled="true"
                    className={cn(baseClassName, "cursor-default text-muted")}
                  >
                    {item.label}
                  </div>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    baseClassName,
                    isActive
                      ? "bg-accent-muted text-accent font-semibold"
                      : "font-normal text-muted hover:bg-[#faf7f6] hover:text-[#4d4d4d]",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
