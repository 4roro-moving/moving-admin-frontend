import { ADMIN_GIVEAWAY_LIST_PAGE_LIMIT } from "@/lib/constants/adminGiveaways";
import type {
  AdminGiveawayItem,
  AdminGiveawayListResult,
  AdminGiveawaySort,
} from "@/types/adminGiveaway";

/** API 연동 전 화면 확인용 임시 목업 (3건) */
export const MOCK_ADMIN_GIVEAWAYS: AdminGiveawayItem[] = [
  {
    id: 301,
    contentType: "GIVEAWAY",
    isHidden: false,
    status: "AVAILABLE",
    title: "원룸 책상 나눔합니다",
    description: "이사 가서 안 쓰는 나무 책상입니다. 직접 가져가실 분만 신청해주세요.",
    author: {
      id: "gw-author-1",
      name: "최유진",
      email: "yujin.choi@example.com",
    },
    region: { id: 11, name: "서울 강남구" },
    reportCount: 0,
    latestModeration: null,
    createdAt: "2026-08-19T07:10:00.000Z",
    updatedAt: "2026-08-19T07:10:00.000Z",
  },
  {
    id: 302,
    contentType: "GIVEAWAY",
    isHidden: false,
    status: "IN_PROGRESS",
    title: "유아용 의자 나눔",
    description: "사용감 있지만 깨끗합니다. 거래 희망 지역은 마포입니다.",
    author: {
      id: "gw-author-2",
      name: "정민호",
      email: "minho.jung@example.com",
    },
    region: { id: 14, name: "서울 마포구" },
    reportCount: 1,
    latestModeration: null,
    createdAt: "2026-08-16T12:45:00.000Z",
    updatedAt: "2026-08-16T12:45:00.000Z",
  },
  {
    id: 303,
    contentType: "GIVEAWAY",
    isHidden: true,
    status: "COMPLETED",
    title: "가전제품 무료 나눔",
    description: "연락처와 개인정보가 본문에 포함되어 있어 숨김 처리된 게시글입니다.",
    author: {
      id: "gw-author-3",
      name: "오세린",
      email: "serin.oh@example.com",
    },
    region: null,
    reportCount: 4,
    latestModeration: {
      action: "HIDE",
      reason: "개인정보(연락처) 노출로 커뮤니티 가이드라인 위반",
      adminName: "관리자",
      createdAt: "2026-08-14T09:55:00.000Z",
    },
    createdAt: "2026-08-13T16:00:00.000Z",
    updatedAt: "2026-08-14T09:55:00.000Z",
  },
];

function sortGiveaways(items: AdminGiveawayItem[], sort: AdminGiveawaySort): AdminGiveawayItem[] {
  const sorted = [...items];

  switch (sort) {
    case "OLDEST":
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "REPORT_HIGH":
      return sorted.sort(
        (a, b) => b.reportCount - a.reportCount || b.createdAt.localeCompare(a.createdAt),
      );
    case "LATEST":
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

function matchesKeyword(item: AdminGiveawayItem, keyword: string): boolean {
  const normalized = keyword.toLowerCase();
  return (
    item.title.toLowerCase().includes(normalized) ||
    item.description.toLowerCase().includes(normalized) ||
    item.author.name.toLowerCase().includes(normalized) ||
    item.author.email.toLowerCase().includes(normalized) ||
    (item.region?.name.toLowerCase().includes(normalized) ?? false)
  );
}

export function listMockAdminGiveaways(params: {
  page?: number;
  limit?: number;
  sort?: AdminGiveawaySort;
  keyword?: string;
  items?: AdminGiveawayItem[];
}): AdminGiveawayListResult {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_GIVEAWAY_LIST_PAGE_LIMIT;
  const sort = params.sort ?? "LATEST";
  const source = params.items ?? MOCK_ADMIN_GIVEAWAYS;
  const keyword = params.keyword?.trim();

  const filtered = keyword ? source.filter((item) => matchesKeyword(item, keyword)) : [...source];
  const sorted = sortGiveaways(filtered, sort);
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;

  return {
    items: sorted.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      totalCount,
      totalPages,
      hasNext: safePage < totalPages,
    },
  };
}
