/**
 * ============================================================================
 * IGradeBookFilter Interface
 * ============================================================================
 * Parámetros reactivos de filtrado para consultar la matriz de calificaciones.
 * ============================================================================
 */
export interface IGradeBookFilter {
  readonly gradeSectionId: string;
  readonly subjectId: string;
  readonly academicYear: string;
}
