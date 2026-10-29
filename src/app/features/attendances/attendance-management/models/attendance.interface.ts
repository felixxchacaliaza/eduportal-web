import { AttendanceStatus } from './attendance-status.type';

/**
 * ============================================================================
 * IAttendance Interface
 * ============================================================================
 * Contrato que representa el registro de asistencia individual de un estudiante.
 * ============================================================================
 */
export interface IAttendance {
  readonly id: string;
  readonly code: string;
  readonly date: string;
  readonly academicYear: string;
  readonly gradeSection: any;
  readonly student: {
    readonly id: string;
    readonly code?: string;
    readonly person?: {
      readonly id: string;
      readonly dni: string;
      readonly firstName: string;
      readonly lastName: string;
      readonly gender?: string;
      readonly personalEmail?: string;
      readonly phone?: string;
    };
  };
  readonly status: AttendanceStatus;
  readonly observation?: string;
  readonly registeredBy?: any;
  readonly enabled: boolean;
}
