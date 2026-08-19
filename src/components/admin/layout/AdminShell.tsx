"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const isContentsSection = pathname === "/contents" || pathname.startsWith("/contents/");

  useEffect(() => {
    if (!isAuthenticated) router.replace(APP_ROUTES.LOGIN);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

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
