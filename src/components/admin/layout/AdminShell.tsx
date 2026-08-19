"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarId = useId();
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const initialPathnameRef = useRef(pathname);
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(APP_ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (initialPathnameRef.current === pathname) {
      return;
    }

    initialPathnameRef.current = pathname;
    closeSidebar();
  }, [closeSidebar, pathname]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        sidebarId={sidebarId}
        onToggleSidebar={() => {
          setIsSidebarOpen((open) => !open);
        }}
      />

      <div className="min-h-[calc(100vh-54px)] xl:flex xl:min-h-[calc(100vh-74px)]">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          sidebarId={sidebarId}
        />

        <div className="flex min-h-[calc(100vh-54px)] min-w-0 flex-1 flex-col xl:min-h-[calc(100vh-74px)]">
          <main className="flex-1 px-6 py-6 md:px-[72px] md:py-8 xl:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
