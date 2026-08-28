"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { logoutAdmin } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { getCurrentAdminNavigation } from "@/lib/constants/adminNavigation";
import { cn } from "@/lib/utils/cn";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  sidebarId: string;
  onToggleSidebar: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
}

export default function AdminHeader({
  isSidebarOpen,
  sidebarId,
  onToggleSidebar,
  menuButtonRef,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAdminAuthStore((state) => state.user);
  const clearSession = useAdminAuthStore((state) => state.clearSession);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const initialPathnameRef = useRef(pathname);
  const closeProfileMenu = useCallback(() => {
    setIsProfileMenuOpen(false);
  }, []);

  const adminName = useMemo(() => {
    const trimmedName = user?.name?.trim();
    return trimmedName && trimmedName.length > 0 ? trimmedName : "관리자";
  }, [user?.name]);
  const currentNavigation = useMemo(() => getCurrentAdminNavigation(pathname), [pathname]);
  const desktopMenuLabel = currentNavigation?.child
    ? `${currentNavigation.parent.label} / ${currentNavigation.child.label}`
    : currentNavigation?.parent.label ?? "관리자 영역";
  const compactMenuLabel = currentNavigation?.child?.label ?? currentNavigation?.parent.label ?? "관리자 영역";

  const adminInitial = adminName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setLogoutError(null);
    setIsLoggingOut(true);
    closeProfileMenu();

    try {
      await logoutAdmin();
      clearSession();
      router.replace(APP_ROUTES.LOGIN);
    } catch (error) {
      setLogoutError(
        getApiErrorMessage(error, "로그아웃에 실패했습니다. 다시 시도해 주세요."),
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (initialPathnameRef.current === pathname) {
      return;
    }

    initialPathnameRef.current = pathname;
    closeProfileMenu();
  }, [closeProfileMenu, pathname]);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (target instanceof Node && profileMenuRef.current?.contains(target)) {
        return;
      }

      closeProfileMenu();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProfileMenu();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeProfileMenu, isProfileMenuOpen]);

  return (
    <header className="bg-surface relative border-b border-[#d9d9d9]">
      <div className="flex h-[54px] items-center justify-between gap-3 px-6 md:px-[72px] xl:h-[74px] xl:px-10">
        <div className="flex min-w-0 items-center gap-3 xl:gap-5">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="관리자 메뉴"
            aria-expanded={isSidebarOpen}
            aria-controls={sidebarId}
            onClick={onToggleSidebar}
            className="border-border text-[#262524] flex size-10 items-center justify-center rounded-xl border bg-surface xl:hidden"
          >
            <MenuIcon className="size-5" />
          </button>

          <div className="hidden min-w-0 flex-col gap-0.5 xl:flex">
            <p className="text-muted hidden text-xs font-medium xl:block">
              MOVING ADMIN
            </p>
            <h1 className="truncate text-base font-semibold text-[#262524] xl:text-[20px] xl:leading-[1.3] xl:font-bold">
              {desktopMenuLabel}
            </h1>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 justify-center xl:hidden">
          <p className="truncate px-2 text-sm font-semibold text-[#262524]">
            {compactMenuLabel}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              aria-label="관리자 프로필 메뉴"
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
              aria-controls={isProfileMenuOpen ? "admin-profile-menu" : undefined}
              onClick={() => {
                setIsProfileMenuOpen((open) => !open);
              }}
              className="flex items-center gap-2 rounded-xl border border-[#e6e6e6] bg-surface px-2 py-1.5 pr-2.5 transition hover:bg-[#faf7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9502e]/30"
            >
              <div className="flex size-7 items-center justify-center rounded-full bg-[#fdf1ec] text-sm font-normal text-[#bfa49a]">
                {adminInitial}
              </div>
              <div className="hidden min-w-0 text-left xl:flex xl:text-sm xl:leading-[1.2] xl:text-[#262524]">
                <span className="truncate font-normal">{adminName}</span>
              </div>
              <span
                aria-hidden="true"
                className={cn(
                  "text-sm font-normal text-muted transition-transform",
                  isProfileMenuOpen && "rotate-180",
                )}
              >
                ⌄
              </span>
            </button>

            {isProfileMenuOpen ? (
              <div
                id="admin-profile-menu"
                role="menu"
                aria-label="관리자 프로필 메뉴"
                className="border-border bg-surface absolute top-[calc(100%+10px)] right-0 z-50 flex w-[176px] flex-col rounded-2xl border py-2 shadow-select"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    void handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="text-text-secondary hover:bg-background-hover flex w-full items-center px-4 py-3 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? "로그아웃 중" : "로그아웃"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {logoutError ? (
        <p
          className="absolute top-[calc(100%+8px)] right-6 z-50 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm text-red-600 shadow-sm md:right-[72px] xl:right-10"
          role="alert"
        >
          {logoutError}
        </p>
      ) : null}
    </header>
  );
}
