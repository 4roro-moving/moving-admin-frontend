import { APP_ROUTES } from "./appRoutes";

export interface AdminNavigationChildItem {
  label: string;
  href?: string;
  enabled: boolean;
}

interface AdminNavigationBaseItem {
  label: string;
  enabled: boolean;
}

export interface AdminNavigationLinkItem extends AdminNavigationBaseItem {
  href: string;
  children?: never;
}

export interface AdminNavigationGroupItem extends AdminNavigationBaseItem {
  href?: never;
  children: AdminNavigationChildItem[];
}

export type AdminNavigationItem = AdminNavigationLinkItem | AdminNavigationGroupItem;

export const ADMIN_CONTENTS_CHILDREN: AdminNavigationChildItem[] = [
  { label: "리뷰 관리", href: APP_ROUTES.CONTENTS.REVIEWS, enabled: true },
  { label: "거주 후기 관리", enabled: false },
  { label: "나눔 관리", enabled: false },
];

export const ADMIN_NAVIGATION_ITEMS: AdminNavigationItem[] = [
  { label: "대시보드", href: APP_ROUTES.DASHBOARD, enabled: true },
  { label: "회원 관리", href: APP_ROUTES.MEMBERS, enabled: true },
  { label: "기사 관리", href: APP_ROUTES.MOVERS, enabled: true },
  { label: "신고 관리", href: APP_ROUTES.REPORTS, enabled: true },
  { label: "콘텐츠 관리", enabled: true, children: ADMIN_CONTENTS_CHILDREN },
  { label: "공지사항 관리", href: "/notices", enabled: false },
  { label: "FAQ 관리", href: "/faqs", enabled: false },
  { label: "문의 관리", href: "/inquiries", enabled: false },
  { label: "약관 관리", href: APP_ROUTES.TERMS, enabled: false },
];

export function isAdminNavigationChildActive(
  pathname: string,
  child: AdminNavigationChildItem,
): boolean {
  if (!child.href) {
    return false;
  }

  return pathname === child.href || pathname.startsWith(`${child.href}/`);
}

export function isAdminNavigationGroupItem(
  item: AdminNavigationItem,
): item is AdminNavigationGroupItem {
  return "children" in item && Array.isArray(item.children);
}

export function isAdminNavigationActive(
  pathname: string,
  item: AdminNavigationItem,
): boolean {
  if (isAdminNavigationGroupItem(item)) {
    return item.children.some((child) => isAdminNavigationChildActive(pathname, child));
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getCurrentAdminNavigation(
  pathname: string,
): {
  parent: AdminNavigationItem;
  child?: AdminNavigationChildItem;
} | null {
  for (const item of ADMIN_NAVIGATION_ITEMS) {
    if (isAdminNavigationGroupItem(item)) {
      const activeChild = item.children.find((child) =>
        isAdminNavigationChildActive(pathname, child),
      );

      if (activeChild) {
        return { parent: item, child: activeChild };
      }

      continue;
    }

    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      return { parent: item };
    }
  }

  return null;
}
