import { ADMIN_REVIEW_LIST_PAGE_LIMIT } from "@/lib/api/adminReviews";
import type {
  AdminReviewItem,
  AdminReviewListQuery,
  AdminReviewListResult,
  AdminReviewSort,
} from "@/types/adminReview";

const MOCK_REVIEWS_SEED: AdminReviewItem[] = [
  {
    id: 101,
    contentType: "REVIEW",
    isHidden: false,
    rating: 5,
    content: "이사 전날까지 꼼꼼하게 체크해 주셔서 정말 감사했어요. 짐도 하나도 다치지 않았습니다.",
    author: { id: "c1a2b3c4-d5e6-7890-abcd-ef1234567890", name: "김민지", email: "minji.kim@example.com" },
    mover: { id: "m1a2b3c4-d5e6-7890-abcd-ef1234567891", name: "박준호" },
    estimateId: 5001,
    reportCount: 0,
    latestModeration: null,
    createdAt: "2026-08-04T09:15:00.000Z",
    updatedAt: "2026-08-04T09:15:00.000Z",
  },
  {
    id: 102,
    contentType: "REVIEW",
    isHidden: false,
    rating: 4,
    content: "전반적으로 만족스러웠고 시간 약속도 잘 지켜주셨어요. 포장만 조금 더 신경 써주시면 좋겠습니다.",
    author: { id: "c2b3c4d5-e6f7-8901-bcde-f12345678902", name: "이서연", email: "seoyeon.lee@example.com" },
    mover: { id: "m2b3c4d5-e6f7-8901-bcde-f12345678903", name: "최동훈" },
    estimateId: 5002,
    reportCount: 1,
    latestModeration: null,
    createdAt: "2026-08-03T14:42:00.000Z",
    updatedAt: "2026-08-03T14:42:00.000Z",
  },
  {
    id: 103,
    contentType: "REVIEW",
    isHidden: true,
    rating: 2,
    content: "견적과 실제 비용이 달랐고, 응대도 불친절했습니다. 다시는 이용하지 않을 것 같아요.",
    author: { id: "c3c4d5e6-f7a8-9012-cdef-123456789004", name: "정우진", email: "woojin.jung@example.com" },
    mover: { id: "m3c4d5e6-f7a8-9012-cdef-123456789005", name: "한지민" },
    estimateId: 5003,
    reportCount: 5,
    latestModeration: {
      action: "HIDE",
      reason: "신고 누적 및 욕설성 표현 포함",
      adminName: "관리자",
      createdAt: "2026-08-02T11:20:00.000Z",
    },
    createdAt: "2026-08-01T18:05:00.000Z",
    updatedAt: "2026-08-02T11:20:00.000Z",
  },
  {
    id: 104,
    contentType: "REVIEW",
    isHidden: false,
    rating: 5,
    content: "짐이 많았는데도 빠르게 옮겨주셨어요. 기사님이 친절해서 다음에도 이용할 예정입니다.",
    author: { id: "c4d5e6f7-a8b9-0123-def0-234567890105", name: "박하은", email: "haeun.park@example.com" },
    mover: { id: "m4d5e6f7-a8b9-0123-def0-234567890106", name: "오세훈" },
    estimateId: 5004,
    reportCount: 0,
    latestModeration: null,
    createdAt: "2026-07-30T10:30:00.000Z",
    updatedAt: "2026-07-30T10:30:00.000Z",
  },
  {
    id: 105,
    contentType: "REVIEW",
    isHidden: true,
    rating: 1,
    content: "사진과 다른 차량이 왔고, 추가 비용을 요구했습니다. 신고했습니다.",
    author: { id: "c5e6f7a8-b9c0-1234-ef01-345678901206", name: "윤도현", email: "dohyun.yoon@example.com" },
    mover: { id: "m5e6f7a8-b9c0-1234-ef01-345678901207", name: "강민수" },
    estimateId: 5005,
    reportCount: 8,
    latestModeration: {
      action: "HIDE",
      reason: "허위 사실 및 과도한 비용 관련 신고 다수",
      adminName: "관리자",
      createdAt: "2026-07-29T16:45:00.000Z",
    },
    createdAt: "2026-07-28T08:12:00.000Z",
    updatedAt: "2026-07-29T16:45:00.000Z",
  },
  {
    id: 106,
    contentType: "REVIEW",
    isHidden: false,
    rating: 3,
    content: "무난하게 이사는 끝났지만, 도착 시간이 조금 늦었어요.",
    author: { id: "c6f7a8b9-c0d1-2345-f012-456789012307", name: "송지아", email: "jia.song@example.com" },
    mover: { id: "m6f7a8b9-c0d1-2345-f012-456789012308", name: "임재범" },
    estimateId: 5006,
    reportCount: 0,
    latestModeration: null,
    createdAt: "2026-07-27T13:55:00.000Z",
    updatedAt: "2026-07-27T13:55:00.000Z",
  },
  {
    id: 107,
    contentType: "REVIEW",
    isHidden: false,
    rating: 4,
    content: "가격 대비 서비스가 좋았고, 큰 가구도 안전하게 운반해 주셨습니다.",
    author: { id: "c7a8b9c0-d1e2-3456-0123-567890123408", name: "한유나", email: "yuna.han@example.com" },
    mover: { id: "m7a8b9c0-d1e2-3456-0123-567890123409", name: "박준호" },
    estimateId: 5007,
    reportCount: 2,
    latestModeration: null,
    createdAt: "2026-07-25T19:20:00.000Z",
    updatedAt: "2026-07-25T19:20:00.000Z",
  },
  {
    id: 108,
    contentType: "REVIEW",
    isHidden: false,
    rating: 5,
    content: "처음 이사인데 설명도 자세히 해주시고 마무리까지 깔끔했어요!",
    author: { id: "c8b9c0d1-e2f3-4567-1234-678901234509", name: "조은별", email: "eunbyeol.cho@example.com" },
    mover: { id: "m8b9c0d1-e2f3-4567-1234-678901234510", name: "서지훈" },
    estimateId: 5008,
    reportCount: 0,
    latestModeration: null,
    createdAt: "2026-07-24T07:40:00.000Z",
    updatedAt: "2026-07-24T07:40:00.000Z",
  },
  {
    id: 109,
    contentType: "REVIEW",
    isHidden: false,
    rating: 2,
    content: "리뷰 내용에 부적절한 표현이 포함되어 있어 숨김 처리 대상입니다.",
    author: { id: "c9c0d1e2-f3a4-5678-2345-789012345610", name: "문태양", email: "taeyang.moon@example.com" },
    mover: { id: "m9c0d1e2-f3a4-5678-2345-789012345611", name: "최동훈" },
    estimateId: 5009,
    reportCount: 3,
    latestModeration: {
      action: "UNHIDE",
      reason: "신고 내용 재검토 후 복구",
      adminName: "관리자",
      createdAt: "2026-07-23T12:00:00.000Z",
    },
    createdAt: "2026-07-22T15:18:00.000Z",
    updatedAt: "2026-07-23T12:00:00.000Z",
  },
  {
    id: 110,
    contentType: "REVIEW",
    isHidden: false,
    rating: 4,
    content: "빠르고 정확하게 이사해 주셨습니다. 추천합니다.",
    author: { id: "cad1e2f3-a4b5-6789-3456-890123456711", name: "강서윤", email: "seoyun.kang@example.com" },
    mover: { id: "mad1e2f3-a4b5-6789-3456-890123456712", name: "한지민" },
    estimateId: 5010,
    reportCount: 0,
    latestModeration: null,
    createdAt: "2026-07-21T11:05:00.000Z",
    updatedAt: "2026-07-21T11:05:00.000Z",
  },
  {
    id: 111,
    contentType: "REVIEW",
    isHidden: false,
    rating: 5,
    content: "에어컨 분리 설치까지 도와주셔서 감사했습니다.",
    author: { id: "cbe2f3a4-b5c6-7890-4567-901234567812", name: "오지훈", email: "jihun.oh@example.com" },
    mover: { id: "mbe2f3a4-b5c6-7890-4567-901234567813", name: "오세훈" },
    estimateId: 5011,
    reportCount: 1,
    latestModeration: null,
    createdAt: "2026-07-20T16:33:00.000Z",
    updatedAt: "2026-07-20T16:33:00.000Z",
  },
  {
    id: 112,
    contentType: "REVIEW",
    isHidden: false,
    rating: 3,
    content: "서비스는 괜찮았지만 응답이 조금 늦었어요.",
    author: { id: "ccf3a4b5-c6d7-8901-5678-012345678913", name: "신다은", email: "daeun.shin@example.com" },
    mover: { id: "mcf3a4b5-c6d7-8901-5678-012345678914", name: "강민수" },
    estimateId: 5012,
    reportCount: 0,
    latestModeration: null,
    createdAt: "2026-07-19T09:50:00.000Z",
    updatedAt: "2026-07-19T09:50:00.000Z",
  },
];

let mockReviews: AdminReviewItem[] = structuredClone(MOCK_REVIEWS_SEED);

function sortReviews(items: AdminReviewItem[], sort: AdminReviewSort): AdminReviewItem[] {
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

function filterReviews(items: AdminReviewItem[], query: AdminReviewListQuery): AdminReviewItem[] {
  const keyword = query.keyword?.trim().toLowerCase();
  if (!keyword) {
    return [...items];
  }

  return items.filter(
    (item) =>
      item.content.toLowerCase().includes(keyword) ||
      item.author.name.toLowerCase().includes(keyword) ||
      item.author.email.toLowerCase().includes(keyword) ||
      item.mover.name.toLowerCase().includes(keyword),
  );
}

export function listMockAdminReviews(query: AdminReviewListQuery = {}): AdminReviewListResult {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_REVIEW_LIST_PAGE_LIMIT;
  const sort = query.sort ?? "LATEST";

  const filtered = sortReviews(filterReviews(mockReviews, query), sort);
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    pagination: {
      page: safePage,
      limit,
      totalCount,
      totalPages,
      hasNext: safePage < totalPages,
    },
  };
}

export function hideMockAdminReview(reviewId: number, reason: string): AdminReviewItem {
  const review = mockReviews.find((item) => item.id === reviewId);
  if (!review) {
    throw new Error("리뷰를 찾을 수 없습니다.");
  }

  const now = new Date().toISOString();
  review.isHidden = true;
  review.updatedAt = now;
  review.latestModeration = {
    action: "HIDE",
    reason,
    adminName: "관리자",
    createdAt: now,
  };

  return structuredClone(review);
}

export function unhideMockAdminReview(reviewId: number, reason?: string): AdminReviewItem {
  const review = mockReviews.find((item) => item.id === reviewId);
  if (!review) {
    throw new Error("리뷰를 찾을 수 없습니다.");
  }

  const now = new Date().toISOString();
  review.isHidden = false;
  review.updatedAt = now;
  review.latestModeration = {
    action: "UNHIDE",
    reason: reason ?? null,
    adminName: "관리자",
    createdAt: now,
  };

  return structuredClone(review);
}

export function resetMockAdminReviews(): void {
  mockReviews = structuredClone(MOCK_REVIEWS_SEED);
}
