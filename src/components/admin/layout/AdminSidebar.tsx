"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type TransitionEvent,
} from "react";
import { createPortal } from "react-dom";

import { ChevronDownIcon } from "@/icons";
import {
  ADMIN_NAVIGATION_ITEMS,
  getCurrentAdminNavigation,
  isAdminNavigationActive,
  isAdminNavigationChildActive,
  type AdminNavigationGroupItem,
  type AdminNavigationItem,
} from "@/lib/constants/adminNavigation";
import { cn } from "@/lib/utils/cn";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

function CloseIcon({ className = "" }: { className?: string }) {
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
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarId: string;
}

function isNavigationGroup(item: AdminNavigationItem): item is AdminNavigationGroupItem {
  return "children" in item;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );

  return Array.from(focusableElements).filter((element) => {
    if (element.hasAttribute("disabled")) {
      return false;
    }

    return !element.hasAttribute("aria-hidden");
  });
}

export default function AdminSidebar({
  isOpen,
  onClose,
  sidebarId,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const user = useAdminAuthStore((state) => state.user);
  const [shouldRenderMobileDrawer, setShouldRenderMobileDrawer] = useState(false);
  const currentNavigation = getCurrentAdminNavigation(pathname);
  const isContentsGroupActive = currentNavigation?.parent.label === "콘텐츠 관리";
  const [isContentsGroupOpen, setIsContentsGroupOpen] = useState(isContentsGroupActive);
  const desktopContentsGroupId = useId();
  const mobileContentsGroupId = useId();
  const mobileDrawerRef = useRef<HTMLElement>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);

  const adminName = user?.name?.trim() || "관리자";
  const adminEmail = user?.email?.trim() || "admin@moving.com";

  if (isOpen && !shouldRenderMobileDrawer) {
    setShouldRenderMobileDrawer(true);
  }

  useEffect(() => {
    if (!isOpen || !shouldRenderMobileDrawer) {
      return;
    }

    const focusTarget = mobileCloseButtonRef.current;
    if (!focusTarget) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      focusTarget.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isOpen, shouldRenderMobileDrawer]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsContentsGroupOpen(isContentsGroupActive);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isContentsGroupActive, pathname]);

  const renderNavigationList = (isMobileDrawer: boolean) => (
    <ul className="mt-1 space-y-1.5">
      {ADMIN_NAVIGATION_ITEMS.map((item) => {
        if (isNavigationGroup(item)) {
          const isParentActive = isAdminNavigationActive(pathname, item);
          const isExpanded = isContentsGroupOpen;
          const contentsGroupId = isMobileDrawer
            ? mobileContentsGroupId
            : desktopContentsGroupId;
          const baseClassName =
            "flex h-[43px] w-full items-center justify-between rounded-xl px-[14px] py-3 text-[13px] leading-none transition";

          return (
            <li key={item.label}>
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={isExpanded ? contentsGroupId : undefined}
                className={cn(
                  baseClassName,
                  isParentActive
                    ? "bg-accent-muted text-accent font-semibold"
                    : "font-normal text-muted hover:bg-[#faf7f6] hover:text-[#4d4d4d]",
                )}
                onClick={() => {
                  setIsContentsGroupOpen((open) => !open);
                }}
              >
                <span>{item.label}</span>
                <ChevronDownIcon
                  className={cn("size-4 transition-transform", isExpanded && "rotate-180")}
                />
              </button>

              {isExpanded ? (
                <ul
                  id={contentsGroupId}
                  className="mt-1 space-y-1 pl-3"
                  aria-label={`${item.label} 하위 메뉴`}
                >
                  {item.children.map((child) => {
                    const isChildActive = isAdminNavigationChildActive(pathname, child);
                    const childClassName =
                      "flex min-h-[39px] items-center rounded-xl px-[14px] py-2 text-[13px] leading-none transition";

                    if (!child.enabled || !child.href) {
                      return (
                        <li key={child.label}>
                          <div
                            aria-disabled="true"
                            className={cn(
                              childClassName,
                              "cursor-default text-muted/70",
                            )}
                          >
                            <span>{child.label}</span>
                          </div>
                        </li>
                      );
                    }

                    return (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          aria-current={isChildActive ? "page" : undefined}
                          className={cn(
                            childClassName,
                            isChildActive
                              ? "bg-accent-muted text-accent font-semibold"
                              : "font-normal text-muted hover:bg-[#faf7f6] hover:text-[#4d4d4d]",
                          )}
                          onClick={() => {
                            if (isMobileDrawer) {
                              onClose();
                            }
                          }}
                        >
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        }

        const isActive = item.enabled && isAdminNavigationActive(pathname, item);
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
              onClick={() => {
                if (isMobileDrawer) {
                  onClose();
                }
              }}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const handleDrawerTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.propertyName !== "transform" || isOpen) {
      return;
    }

    setShouldRenderMobileDrawer(false);
  };

  const handleDrawerKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") {
      return;
    }

    const drawerElement = mobileDrawerRef.current;
    if (!drawerElement) {
      return;
    }

    const focusableElements = getFocusableElements(drawerElement);
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === firstElement || !drawerElement.contains(activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }

      return;
    }

    if (activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <>
      <aside className="bg-surface hidden w-[240px] shrink-0 border-r border-[#d9d9d9] xl:flex xl:flex-col">
        <nav className="flex-1 px-5 py-8" aria-label="관리자 메뉴">
          <p className="text-muted text-sm font-bold">관리 메뉴</p>
          {renderNavigationList(false)}
        </nav>
      </aside>

      {typeof document !== "undefined" && shouldRenderMobileDrawer
        ? createPortal(
            <>
              <button
                type="button"
                aria-label="관리자 메뉴 닫기"
                aria-hidden={!isOpen}
                tabIndex={isOpen ? 0 : -1}
                className={cn(
                  "fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 xl:hidden",
                  isOpen ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                onClick={onClose}
              />

              <aside
                ref={mobileDrawerRef}
                id={sidebarId}
                role="dialog"
                aria-modal="true"
                aria-hidden={!isOpen}
                aria-label="관리자 메뉴"
                inert={!isOpen ? true : undefined}
                onKeyDown={handleDrawerKeyDown}
                onTransitionEnd={handleDrawerTransitionEnd}
                className={cn(
                  "bg-surface fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-[#d9d9d9] transition-transform duration-200 ease-out xl:hidden",
                  isOpen ? "translate-x-0" : "-translate-x-full",
                )}
              >
                <div className="flex h-[54px] items-center justify-between border-b border-[#d9d9d9] px-5">
                  <div className="flex flex-col">
                    <span className="text-muted text-xs font-medium">MOVING ADMIN</span>
                    <span className="text-sm font-semibold text-[#262524]">관리 메뉴</span>
                  </div>
                  <button
                    ref={mobileCloseButtonRef}
                    type="button"
                    aria-label="관리자 메뉴 닫기"
                    onClick={onClose}
                    tabIndex={isOpen ? 0 : -1}
                    className="border-border text-[#262524] flex size-9 items-center justify-center rounded-xl border bg-surface"
                  >
                    <CloseIcon className="size-[18px]" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="모바일 관리자 메뉴">
                  {renderNavigationList(true)}
                </nav>

                <div className="border-t border-[#d9d9d9] px-5 py-4">
                  <p className="text-[13px] font-semibold text-[#262524]">{adminName}</p>
                  <p className="text-muted mt-1 text-xs">{adminEmail}</p>
                  <p className="text-muted mt-2 text-xs font-medium">ADMIN</p>
                </div>
              </aside>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
