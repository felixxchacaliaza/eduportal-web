import { GradeSectionItem } from '../../../../models/interfaces/grade-section-item.interface';

export interface GradesSectionsSaveDialogData {
  readonly mode: 'create' | 'edit';
  readonly gradeSection?: {
    readonly id: string;
    readonly gradeId: string;
    readonly sectionId: string;
    readonly classroomId?: string;
    readonly shift: string;
    readonly maxCapacity: number;
    readonly enabled: boolean;
  };
  readonly existingSections?: readonly GradeSectionItem[];
}

export interface GradesSectionsSavePayload {
  readonly grade: string;
  readonly section: string;
  readonly classroom?: string;
  readonly shift: string;
  readonly maxCapacity: number;
  readonly academicYear?: string;
  readonly enabled?: boolean;
}