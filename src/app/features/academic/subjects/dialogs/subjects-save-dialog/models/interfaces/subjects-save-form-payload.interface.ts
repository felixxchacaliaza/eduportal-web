export interface SubjectsSaveFormPayload {
  readonly name: string;
  readonly area: string;
  readonly weeklyHours: number;
  readonly description?: string;
  readonly enabled?: boolean;
}