import { AttendanceStatus } from './attendance-status.type';

/**
 * ============================================================================
 * IBulkAttendanceItem Interface
 * ============================================================================
 * Ítem de asistencia individual dentro de la carga masiva transaccional.
 * ============================================================================
 */
export interface IBulkAttendanceItem {
  readonly student: string;
  readonly status: AttendanceStatus;
  readonly observation?: string;
  readonly code?: string;
}
