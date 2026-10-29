import { IStudent } from './student.interface';
import { IGradeSectionSummary } from './grade-section-summary.interface';

/**
 * ============================================================================
 * Enrollment Interfaces & DTOs
 * ============================================================================
 * Contratos de transacciones de matrícula escolar anual.
 * ============================================================================
 */

export type EnrollmentStatusType = 'MATRICULADO' | 'TRASLADADO' | 'RETIRADO';
export type EnrollmentType = 'REGULAR' | 'INGRESANTE' | 'TRASLADO';

export interface IEnrollment {
  id: string;
  code: string;
  student: string | IStudent;
  gradeSection: string | IGradeSectionSummary;
  academicYear: string;
  enrollmentType?: EnrollmentType;
  status: EnrollmentStatusType;
  enrolledAt?: string;
  observation?: string;
  enabled: boolean;
}

export interface IEnrollStudentRequestDto {
  student: string; // ObjectId del alumno
  gradeSection: string; // ObjectId del salón
  academicYear: string; // "2026"
  enrollmentType?: EnrollmentType;
  status?: EnrollmentStatusType;
  observation?: string;
}
