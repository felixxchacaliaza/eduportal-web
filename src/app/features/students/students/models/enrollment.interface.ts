import { IStudent } from './student.interface';
import { IGradeSectionSummary } from './grade-section-summary.interface';

/**
 * ============================================================================
 * Enrollment Interfaces & DTOs
 * ============================================================================
 * Contratos de transacciones de matrícula escolar anual.
 * ============================================================================
 */

export type EnrollmentStatusType = 'DEFINITIVA' | 'CONDICIONAL' | 'TRASLADADO' | 'RETIRADO';

export interface IEnrollment {
  id: string;
  code: string;
  student: string | IStudent;
  gradeSection: string | IGradeSectionSummary;
  academicYear: string;
  enrollmentDate: string;
  status: EnrollmentStatusType;
  observation?: string;
  enabled: boolean;
}

export interface IEnrollStudentRequestDto {
  student: string; // ObjectId del alumno
  gradeSection: string; // ObjectId del salón
  academicYear: string; // "2026"
  status: EnrollmentStatusType;
  observation?: string;
}
