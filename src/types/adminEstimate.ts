export interface AdminEstimateCancellationPayload {
  reason: string;
  internalNote?: string;
}

export interface AdminEstimateCancellationResult {
  estimate: {
    id: number;
    status: "CANCELED";
    canceledAt: string;
  };
  estimateRequest: {
    id: number;
    status: "CANCELED";
    canceledAt: string;
  };
}

export interface AdminEstimateCancellationTarget {
  estimateId: number;
  customerName: string;
  moverName: string;
  moverNickname: string;
  moveDate: string;
  price: number;
}
