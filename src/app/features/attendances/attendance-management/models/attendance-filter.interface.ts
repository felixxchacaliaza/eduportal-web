/**
 * ============================================================================
 * IAttendanceFilter Interface
 * ============================================================================
 * Filtros reactivos para consultar la nómina de asistencia escolar por fecha.
 * ============================================================================
 */
export interface IAttendanceFilter {
  readonly gradeSectionId: string;
  readonly date: string;
  readonly academicYear: string;
}
