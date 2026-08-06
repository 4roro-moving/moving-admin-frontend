"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isContentsSection = pathname === "/contents" || pathname.startsWith("/contents/");

  return (
    <div className={isContentsSection ? "flex min-h-screen" : "min-h-screen xl:flex"}>
      {isContentsSection ? null : <AdminSidebar />}
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

