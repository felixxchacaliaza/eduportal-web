export interface GradeStat {
  readonly gradeId: string;
  readonly code: string;
  readonly name: number;
  readonly description: string;
  readonly assignedSubjectsCount: number;
  readonly totalHours: number;
}