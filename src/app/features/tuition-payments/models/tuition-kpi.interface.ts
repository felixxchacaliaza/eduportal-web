export interface ITuitionKpi {
  readonly totalCount: number;
  readonly totalAmount: number;
  readonly paidCount: number;
  readonly paidAmount: number;
  readonly pendingCount: number;
  readonly pendingAmount: number;
  readonly overdueCount: number;
}
