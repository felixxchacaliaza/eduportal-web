import { IStudent, IGradeSectionSummary } from '../../../../models';

/**
 * ============================================================================
 * EnrollmentSaveDialogData Interface
 * ============================================================================
 * Datos inyectados en el modal de matrícula escolar.
 * ============================================================================
 */
export interface EnrollmentSaveDialogData {
  student: IStudent;
  gradeSections?: IGradeSectionSummary[];
}
