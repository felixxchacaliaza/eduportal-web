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
  readonly type: 'LEVE' | 'GRAVE' | 'MUY_GRAVE';
  readonly description: string;
  readonly reportedBy?: any;
  readonly status: 'REGISTRADO' | 'EN_PROCESO' | 'RESUELTO';
  readonly actionTaken?: string;
  readonly enabled?: boolean;
}
