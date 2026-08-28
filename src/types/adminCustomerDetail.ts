import type {
  AdminAccountStatus,
  AdminAccountStatusUpdatePayload,
  AdminAccountStatusUpdateResult,
  AdminInquiryHistory,
  AdminSuspensionHistory,
  AdminTargetReportHistory,
} from "@/types/adminUser";
import type { AdminAuthProvider } from "@/types/adminCustomer";
import type { AdminMoveType } from "@/types/adminMover";

export interface AdminCustomerDetail {
  account: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    authProvider: AdminAuthProvider;
    status: AdminAccountStatus;
    isProfileCompleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  profile: {
    imageUrl: string | null;
    serviceAreas: string[];
    serviceTypes: AdminMoveType[];
  };
  estimateRequests: AdminCustomerEstimateRequests;
  reviewHistory: AdminCustomerReviewHistory;
  reportHistory: {
    filed: AdminTargetReportHistory;
    received: AdminTargetReportHistory;
  };
  inquiryHistory: AdminInquiryHistory;
  suspensionHistory: AdminSuspensionHistory;
}

export type AdminCustomerStatusUpdatePayload = AdminAccountStatusUpdatePayload;
export type AdminCustomerStatusUpdateResult = AdminAccountStatusUpdateResult;

interface AdminCustomerEstimateRequests {
  totalCount: number;
  items: Array<{
    id: number;
    moveType: AdminMoveType;
    status:
      | "PENDING"
      | "OPEN"
      | "CONFIRMED"
      | "CANCELED"
      | "EXPIRED"
      | "COMPLETED";
    moveDate: string;
    expiresAt: string;
    expiredAt: string | null;
    canceledAt: string | null;
    canceledBy: "CUSTOMER" | "ADMIN" | null;
    completedAt: string | null;
    createdAt: string;
    estimateSummary: {
      totalCount: number;
      sentCount: number;
      confirmedCount: number;
      expiredCount: number;
      canceledCount: number;
    };
    confirmedEstimate: {
      id: number;
      mover: {
        id: string;
        name: string;
        nickname: string | null;
      };
      price: number;
      confirmedAt: string | null;
      cancelable: boolean;
    } | null;
  }>;
}

interface AdminCustomerReviewHistory {
  totalCount: number;
  items: Array<{
    id: number;
    moverId: string;
    moverNickname: string;
    rating: number;
    content: string;
    isHidden: boolean;
    createdAt: string;
  }>;
}
