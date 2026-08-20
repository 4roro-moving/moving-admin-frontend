export interface AdminEstimateCancellationPayload {
  reason: string;
  internalNote?: string;
}

export interface AdminEstimateCancellationTarget {
  estimateId: number;
  customerName: string;
  moverName: string;
  moverNickname: string;
  moveDate: string;
  price: number;
}
