export type AssignmentStatus = 'Asignado' | 'No asignado' | 'Deshabilitado';

export interface GradeSubjectRow {
  readonly subjectId: string;
  readonly gradeSubjectId?: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly area: string;
  readonly areaId: string;
  readonly hours: number;
  readonly operationalStatus: 'Activa' | 'Desactiva';
  readonly isAssigned: boolean;
  readonly assignmentStatus: AssignmentStatus;
  readonly color: string;
}