import { Grade } from './grade.interface';
import { Subject } from './subject.interface';

export interface GradeSubject {
  readonly id: string;
  readonly code: string;
  readonly grade: Grade | string;
  readonly subject: Subject | string;
  readonly academicYear: string;
  readonly weeklyHours: number;
  readonly enabled: boolean;
}

