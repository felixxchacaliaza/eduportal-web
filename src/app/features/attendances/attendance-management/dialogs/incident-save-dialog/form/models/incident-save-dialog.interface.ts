/**
 * ============================================================================
 * IncidentSaveDialogData Interface
 * ============================================================================
 * Estructura de datos inyectada al abrir el diálogo modal de incidencias.
 * Regla: 1 sola interfaz por archivo.
 * ============================================================================
 */
export interface IncidentSaveDialogData {
  readonly studentId: string;
  readonly studentName: string;
  readonly studentDni?: string;
  readonly gradeSectionId: string;
  readonly gradeSectionName?: string;
  readonly academicYear?: string;
}
