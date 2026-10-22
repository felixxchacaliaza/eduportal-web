export type AcademicYearStatus = 'PLANIFICACION' | 'ACTIVO' | 'CERRADO';

export interface AcademicYear {
  readonly id: string;
  readonly code: string;
  readonly year: string;
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly status: AcademicYearStatus;
  readonly closedAt?: string | null;
  readonly enabled: boolean;
}

