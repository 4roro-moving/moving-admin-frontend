import type { AdminDashboardData } from "@/types/adminDashboard";

export const MOCK_ADMIN_DASHBOARD: AdminDashboardData = {
  pageTitle: "대시보드",
  pageDescription: "MOVING 서비스와 주요 운영 현황을 한눈에 확인합니다.",
  period: "7d",
  metrics: [
    {
      label: "전체 회원",
      value: "1,284명",
      helper: "서비스 가입 회원",
    },
    {
      label: "활성 기사",
      value: "326명",
      helper: "활동 중 기사",
    },
    {
      label: "처리 대기 신고",
      value: "12건",
      helper: "확인이 필요해요",
      tone: "accent",
    },
    {
      label: "답변 대기 문의",
      value: "8건",
      helper: "답변이 필요해요",
      tone: "accent",
    },
  ],
  recentReports: {
    title: "최근 신고",
    description: "접수된 신고와 처리 상태를 확인합니다.",
    actionLabel: "신고 관리 →",
    items: [
      {
        id: "report-128",
        status: "대기",
        statusTone: "pending",
        primary: "리뷰 · 허위 정보 및 욕설",
        meta: "08.15 14:32",
      },
      {
        id: "report-125",
        status: "대기",
        statusTone: "pending",
        primary: "거주 후기 · 개인정보 노출",
        meta: "08.15 11:20",
      },
      {
        id: "report-123",
        status: "완료",
        statusTone: "resolved",
        primary: "기사 · 부적절한 프로필",
        meta: "08.14 18:05",
      },
    ],
  },
  recentInquiries: {
    title: "최근 문의",
    description: "고객과 기사님의 Q&A 문의 현황입니다.",
    actionLabel: "Q&A 관리 →",
    items: [
      {
        id: "inquiry-76",
        status: "답변 대기",
        statusTone: "pending",
        primary: "견적 이용 문의",
        meta: "고객 · 08.15 16:20",
      },
      {
        id: "inquiry-74",
        status: "답변 대기",
        statusTone: "pending",
        primary: "기사 프로필 승인 문의",
        meta: "기사 · 08.15 13:04",
      },
      {
        id: "inquiry-71",
        status: "답변 완료",
        statusTone: "resolved",
        primary: "계정 정보 변경 문의",
        meta: "고객 · 08.14 17:42",
      },
    ],
  },
  serviceOverview: {
    title: "서비스 운영 현황",
    description: "견적 요청부터 이사 완료까지 주요 서비스 흐름을 한눈에 확인합니다.",
    stages: [
      { label: "견적 요청", value: "248건" },
      { label: "견적 제안", value: "612건" },
      { label: "견적 확정", value: "137건", highlighted: true },
      { label: "이사 완료", value: "103건", valueSize: "large" },
    ],
  },
  contentSummary: {
    title: "콘텐츠 관리 현황",
    description: "리뷰·거주 후기·나눔·공지/FAQ 운영 상태",
    items: [
      { label: "리뷰", value: "숨김 5건", tone: "accent" },
      { label: "거주 후기", value: "숨김 2건", tone: "accent" },
      { label: "나눔 게시글", value: "숨김 4건", tone: "accent" },
      { label: "공지 / FAQ", value: "게시 18건", tone: "default" },
    ],
  },
  recentActivities: {
    title: "최근 관리자 활동",
    description: "운영 처리 이력과 관리자 로그 요약",
    items: [
      {
        action: "신고 처리",
        memo: "리뷰 신고 #128 처리 완료",
        timeAgo: "10분 전",
      },
      {
        action: "콘텐츠 숨김",
        memo: "거주 후기 #42 숨김 처리",
        timeAgo: "32분 전",
      },
      {
        action: "문의 답변",
        memo: "Q&A #76 답변 등록",
        timeAgo: "1시간 전",
      },
      {
        action: "공지 등록",
        memo: "8월 서비스 점검 안내",
        timeAgo: "3시간 전",
      },
    ],
  },
};
