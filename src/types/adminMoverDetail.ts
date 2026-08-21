import type { AdminAuthProvider } from "@/types/adminCustomer";
import type { AdminMoveType } from "@/types/adminMover";
import type {
  AdminReportReason,
  AdminReportStatus,
  AdminReportTargetType,
} from "@/types/adminReport";
import type { AdminAccountStatus } from "@/types/adminUser";

export interface AdminMoverDetail {
  account: {
    id: string;
    email: string;
    name: string;
    phone: string;
    authProvider: AdminAuthProvider;
    status: AdminAccountStatus;
    isProfileCompleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  profile: {
    nickname: string;
    imageUrl: string | null;
    career: number;
    shortIntro: string;
    description: string;
    averageRating: number;
    reviewCount: number;
    confirmedCount: number;
    serviceAreas: string[];
    serviceTypes: AdminMoveType[];
  };
  estimateActivity: {
    inProgress: {
      totalCount: number;
      items: Array<{
        id: number;
        estimateRequestId: number;
        status: "SENT" | "CONFIRMED";
        price: number;
        customer: {
          id: string;
          name: string;
        };
        moveType: AdminMoveType;
        moveDate: string;
        confirmedAt: string | null;
        cancelable: boolean;
        createdAt: string;
      }>;
    };
    recent: {
      totalCount: number;
      items: Array<{
        id: number;
        estimateRequestId: number;
        status: "COMPLETED" | "CANCELED" | "EXPIRED";
        price: number;
        customer: {
          id: string;
          name: string;
        };
        moveType: AdminMoveType;
        moveDate: string;
        confirmedAt: string | null;
        expiredAt: string | null;
        canceledAt: string | null;
        createdAt: string;
      }>;
    };
  };
  reviewHistory: {
    totalCount: number;
    items: Array<{
      id: number;
      customerId: string;
      rating: number;
      content: string;
      isHidden: boolean;
      createdAt: string;
    }>;
  };
  reportHistory: {
    filed: {
      totalCount: number;
      items: Array<{
        id: number;
        targetType: AdminReportTargetType;
        targetId: string;
        reason: AdminReportReason;
        status: AdminReportStatus;
        createdAt: string;
      }>;
    };
    received: {
      totalCount: number;
      items: Array<{
        id: number;
        reason: AdminReportReason;
        status: AdminReportStatus;
        createdAt: string;
      }>;
    };
  };
  suspensionHistory: {
    totalCount: number;
    items: Array<{
      id: number;
      action: "SUSPEND" | "RELEASE";
      reason: string;
      internalNote: string | null;
      createdAt: string;
      admin: {
        id: string;
        name: string;
      };
    }>;
  };
}
