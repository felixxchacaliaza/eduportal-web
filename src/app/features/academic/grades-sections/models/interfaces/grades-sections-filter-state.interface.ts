export interface GradesSectionsFilterState {
  readonly gradeId: string;
  readonly status: 'ALL' | 'ACTIVE' | 'INACTIVE';
  readonly search: string;
}