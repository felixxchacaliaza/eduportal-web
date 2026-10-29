export interface GradeSectionItem {
  readonly id: string;
  readonly code: string;
  readonly gradeId: string;
  readonly gradeName: string;
  readonly sectionId: string;
  readonly sectionName: string;
  readonly classroomId?: string;
  readonly classroomName: string;
  readonly shift: string;
  readonly maxCapacity: number;
  readonly status: 'Activa' | 'Desactiva';
}