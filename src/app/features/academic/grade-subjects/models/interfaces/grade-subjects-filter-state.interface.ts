export interface GradeSubjectsFilterState {
  readonly year: string;
  readonly area: string;
  readonly assignmentStatus: 'ALL' | 'ASSIGNED' | 'UNASSIGNED';
  readonly search: string;
}