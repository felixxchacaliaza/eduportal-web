/**
 * ============================================================================
 * IIncident Interface
 * ============================================================================
 * Registro de convivencia escolar y disciplina de estudiantes.
 * ============================================================================
 */
export interface IIncident {
  readonly id?: string;
  readonly code?: string;
  readonly student: any;
  readonly gradeSection: any;
  readonly academicYear?: string;
  readonly incidentDate: string;
  readonly title?: string;
  readonly type: 'LEVE' | 'GRAVE' | 'MUY_GRAVE' | 'MERITO' | 'DEMERITO' | 'ATENCION_PSICOLOGICA' | 'CITACION_APODERADO';
  readonly severity?: 'LEVE' | 'MODERADA' | 'GRAVE';
  readonly description: string;
  readonly reportedBy?: any;
  readonly status?: 'ABIERTA' | 'EN_SEGUIMIENTO' | 'CERRADA' | 'REGISTRADO' | 'EN_PROCESO' | 'RESUELTO';
  readonly actionTaken?: string;
  readonly enabled?: boolean;
}
