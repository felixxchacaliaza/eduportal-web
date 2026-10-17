export interface ApiResponse<T> {
  readonly success: boolean;
  readonly count?: number;
  readonly data: T;
  readonly message?: string;
}

