import { IBulkAttendanceItem } from './bulk-attendance-item.interface';

/**
 * ============================================================================
 * BulkAttendanceRequestDto Interface
 * ============================================================================
 * Payload para persistencia masiva hacia POST /api/attendances/bulk.
 * ============================================================================
 */
export interface BulkAttendanceRequestDto {
  readonly attendances: readonly IBulkAttendanceItem[];
  readonly date: string;
  readonly gradeSection: string;
  readonly academicYear: string;
  readonly registeredBy?: string;
}
