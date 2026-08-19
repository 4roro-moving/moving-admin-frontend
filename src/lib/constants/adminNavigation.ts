import { APP_ROUTES } from "./appRoutes";

export interface AdminNavigationItem {
  label: string;
  href: string;
  enabled: boolean;
}

export const ADMIN_NAVIGATION_ITEMS: AdminNavigationItem[] = [
  { label: "대시보드", href: APP_ROUTES.DASHBOARD, enabled: true },
  { label: "회원 관리", href: APP_ROUTES.MEMBERS, enabled: true },
  { label: "기사 관리", href: APP_ROUTES.MOVERS, enabled: true },
  { label: "신고 관리", href: APP_ROUTES.REPORTS, enabled: true },
  { label: "리뷰 관리", href: APP_ROUTES.CONTENTS.REVIEWS, enabled: true },
  { label: "공지사항 관리", href: "/notices", enabled: false },
  { label: "FAQ 관리", href: "/faqs", enabled: false },
  { label: "문의 관리", href: "/inquiries", enabled: false },
  { label: "약관 관리", href: APP_ROUTES.TERMS, enabled: false },
];
