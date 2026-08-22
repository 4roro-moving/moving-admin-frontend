import { ADMIN_RESIDENCE_REVIEW_LIST_PAGE_LIMIT } from "@/lib/constants/adminResidenceReviews";
import type {
  AdminResidenceReviewItem,
  AdminResidenceReviewListResult,
  AdminResidenceReviewSort,
} from "@/types/adminResidenceReview";

/** API 연동 전 화면 확인용 임시 목업 (3건) */
export const MOCK_ADMIN_RESIDENCE_REVIEWS: AdminResidenceReviewItem[] = [
  {
    id: 201,
    contentType: "RESIDENCE_REVIEW",
    isHidden: false,
    rating: 5,
    title: "역삼동 신축 오피스텔 만족",
    content: "방음이 잘 되고 교통이 편리합니다. 관리비도 합리적이에요.",
    author: {
      id: "rr-author-1",
      name: "김나영",
      email: "nayoung.kim@example.com",
    },
    region: { id: 11, name: "서울 강남구" },
    reportCount: 0,
    latestModeration: null,
    createdAt: "2026-08-18T10:20:00.000Z",
    updatedAt: "2026-08-18T10:20:00.000Z",
  },
  {
    id: 202,
    contentType: "RESIDENCE_REVIEW",
    isHidden: false,
    rating: 4,
    title: "마포 투룸 거주 후기",
    content: "주변 편의시설이 많고 한강 접근성이 좋습니다. 주차만 조금 불편해요.",
    author: {
      id: "rr-author-2",
      name: "박서준",
      email: "seojun.park@example.com",
    },
    region: { id: 14, name: "서울 마포구" },
    reportCount: 2,
    latestModeration: null,
    createdAt: "2026-08-15T08:05:00.000Z",
    updatedAt: "2026-08-15T08:05:00.000Z",
  },
  {
    id: 203,
    contentType: "RESIDENCE_REVIEW",
    isHidden: true,
    rating: 2,
    title: "소음 심한 원룸",
    content: "야간 소음이 심하고 관리실 응대가 불친절합니다. 비추천합니다.",
    author: {
      id: "rr-author-3",
      name: "이하늘",
      email: "haneul.lee@example.com",
    },
    region: { id: 5, name: "경기 성남시" },
    reportCount: 6,
    latestModeration: {
      action: "HIDE",
      reason: "개인 비방 및 과도한 비난 표현 포함",
      adminName: "관리자",
      createdAt: "2026-08-12T14:30:00.000Z",
    },
    createdAt: "2026-08-10T19:40:00.000Z",
    updatedAt: "2026-08-12T14:30:00.000Z",
  },
];

function sortResidenceReviews(
  items: AdminResidenceReviewItem[],
  sort: AdminResidenceReviewSort,
): AdminResidenceReviewItem[] {
  const sorted = [...items];

  switch (sort) {
    case "OLDEST":
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "RATING_HIGH":
      return sorted.sort((a, b) => b.rating - a.rating || b.createdAt.localeCompare(a.createdAt));
    case "RATING_LOW":
      return sorted.sort((a, b) => a.rating - b.rating || b.createdAt.localeCompare(a.createdAt));
    case "REPORT_HIGH":
      return sorted.sort(
        (a, b) => b.reportCount - a.reportCount || b.createdAt.localeCompare(a.createdAt),
      );
    case "LATEST":
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

function matchesKeyword(item: AdminResidenceReviewItem, keyword: string): boolean {
  const normalized = keyword.toLowerCase();
  return (
    item.title.toLowerCase().includes(normalized) ||
    item.content.toLowerCase().includes(normalized) ||
    item.author.name.toLowerCase().includes(normalized) ||
    item.author.email.toLowerCase().includes(normalized) ||
    item.region.name.toLowerCase().includes(normalized)
  );
}

export function listMockAdminResidenceReviews(params: {
  page?: number;
  limit?: number;
  sort?: AdminResidenceReviewSort;
  keyword?: string;
  items?: AdminResidenceReviewItem[];
}): AdminResidenceReviewListResult {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_RESIDENCE_REVIEW_LIST_PAGE_LIMIT;
  const sort = params.sort ?? "LATEST";
  const source = params.items ?? MOCK_ADMIN_RESIDENCE_REVIEWS;
  const keyword = params.keyword?.trim();

  const filtered = keyword
    ? source.filter((item) => matchesKeyword(item, keyword))
    : [...source];
  const sorted = sortResidenceReviews(filtered, sort);
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
