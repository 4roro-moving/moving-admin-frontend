"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAVIGATION_ITEMS } from "@/lib/constants/adminNavigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-sidebar text-sidebar-foreground hidden w-72 shrink-0 border-r border-white/10 xl:flex xl:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-xs font-medium tracking-[0.2em] text-white/60">NAVIGATION</p>
        <h2 className="mt-2 text-xl font-semibold">MOVING ADMIN</h2>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {ADMIN_NAVIGATION_ITEMS.map((item) => {
            const isActive = item.enabled && pathname === item.href;

            if (!item.enabled) {
              return (
                <li key={item.label}>
                  <div className="rounded-xl px-4 py-3 text-sm font-medium text-white/40">
                    <span>{item.label}</span>
                    <span className="ml-2 text-xs">TODO</span>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-white text-slate-950" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
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
