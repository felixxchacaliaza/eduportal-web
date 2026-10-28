/**
 * ============================================================================
 * GradeSectionSummary Interface
 * ============================================================================
 * Resumen de salón aperturado para la selección de matrícula y aforo.
 * ============================================================================
 */

export interface IGradeSectionSummary {
  id: string;
  code: string;
  academicYear: string;
  grade: {
    id: string;
    name: number;
    description: string;
  };
  section: {
    id: string;
    name: string;
  };
  classroom: {
    id: string;
    name: string;
    capacity: number;
  };
  shift: 'MAÑANA' | 'TARDE' | 'NOCHE';
  maxCapacity: number;
  enrolledStudents: number;
  availableVacancies?: number;
}
