import { Grade } from './grade.interface';

export interface Section {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly enabled: boolean;
}

export interface Classroom {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly capacity: number;
  readonly floor?: string;
  readonly pavilion?: string;
  readonly enabled: boolean;
}

export type ShiftType = 'MAÑANA' | 'TARDE' | 'NOCHE';

export interface GradeSection {
  readonly id: string;
  readonly code: string;
  readonly academicYear: string;
  readonly grade: Grade | string;
  readonly section: Section | string;
  readonly classroom?: Classroom | string;
  readonly shift: ShiftType;
  readonly maxCapacity: number;
  readonly enrolledCount: number;
  readonly enabled: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}