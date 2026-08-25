import type { AdminListResult } from "@/types/adminUser";

/** 약관 유형. 백엔드 Prisma `TermsType` enum 과 동일합니다. */
export type AdminTermsType =
  | "TERMS_OF_SERVICE"
  | "PRIVACY_POLICY"
  | "MARKETING_POLICY"
  | "LOCATION_POLICY"
  | "MOVER_POLICY"
  | "OTHER";

/**
 * 약관 게시 상태.
 * DRAFT 만 수정·삭제·게시할 수 있습니다. (백엔드 termsService 에서 강제)
 */
export type AdminTermsStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/** 약관 동의 대상 역할. */
export type AdminTermsAudience = "ALL" | "CUSTOMER" | "MOVER";

export interface AdminTermsAuthor {
  id: string;
  name: string;
}

/**
 * 목록 응답 항목.
 * 본문은 수천 자라 목록 응답에 실리지 않습니다(백엔드 termsListSelect).
 */
export interface AdminTermsListItem {
  id: number;
  type: AdminTermsType;
  version: string;
  status: AdminTermsStatus;
  title: string;
  isRequired: boolean;
  audience: AdminTermsAudience;
  effectiveAt: string | null;
  publishedAt: string | null;
  authorId: string;
  author: AdminTermsAuthor | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/** 상세 응답. 목록 항목에 본문이 추가됩니다. */
export interface AdminTerms extends AdminTermsListItem {
  content: string;
}

export interface AdminTermsListQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  type?: AdminTermsType;
  status?: AdminTermsStatus;
}

export type AdminTermsListResult = AdminListResult<AdminTermsListItem>;

/**
 * 생성 payload.
 * 생성 시 상태는 항상 DRAFT 이므로 status 는 보내지 않습니다.
 * type / version 은 약관의 정체성이라 생성 시에만 지정하고 이후 수정할 수 없습니다.
 */
export interface CreateAdminTermsPayload {
  type: AdminTermsType;
  version: string;
  title: string;
  content: string;
  isRequired: boolean;
  audience?: AdminTermsAudience;
  /** YYYY-MM-DD */
  effectiveAt?: string;
}

/** 수정 payload. DRAFT 상태에서만 허용됩니다. */
export interface UpdateAdminTermsPayload {
  title?: string;
  content?: string;
  isRequired?: boolean;
  audience?: AdminTermsAudience;
  /** YYYY-MM-DD */
  effectiveAt?: string;
}

export const ADMIN_TERMS_TYPE_LABELS: Record<AdminTermsType, string> = {
  TERMS_OF_SERVICE: "이용약관",
  PRIVACY_POLICY: "개인정보 처리방침",
  MARKETING_POLICY: "마케팅 정보 수신",
  LOCATION_POLICY: "위치정보 이용약관",
  MOVER_POLICY: "기사님 이용 정책",
  OTHER: "기타",
};

/**
 * 유형 노출 순서.
 * 사용자 화면(`front/src/types/terms.ts` 의 TERMS_TYPE_ORDER)과 같은 순서를 유지합니다.
 */
export const ADMIN_TERMS_TYPE_ORDER: readonly AdminTermsType[] = [
  "TERMS_OF_SERVICE",
  "PRIVACY_POLICY",
  "MARKETING_POLICY",
  "LOCATION_POLICY",
  "MOVER_POLICY",
  "OTHER",
] as const;

export const ADMIN_TERMS_STATUS_LABELS: Record<AdminTermsStatus, string> = {
  DRAFT: "작성 중",
  PUBLISHED: "게시중",
  ARCHIVED: "보관",
};

export const ADMIN_TERMS_AUDIENCE_LABELS: Record<AdminTermsAudience, string> = {
  ALL: "전체",
  CUSTOMER: "고객",
  MOVER: "기사",
};

export function getAdminTermsStatusTone(status: AdminTermsStatus): string {
  switch (status) {
    case "PUBLISHED":
      return "bg-[#dcfce7] text-[#2f855a]";
    case "DRAFT":
      return "bg-accent-muted text-accent";
    default:
      return "bg-background text-muted";
  }
}

/** DRAFT 만 수정·삭제·게시할 수 있습니다. */
export function isAdminTermsEditable(status: AdminTermsStatus): boolean {
  return status === "DRAFT";
}
