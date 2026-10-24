import { GradeSectionItem } from '../../../../models/interfaces/grade-section-item.interface';

/**
 * ============================================================================
 * GradesSectionsSaveDialogData & Payload (Modal Contracts)
 * ============================================================================
 * Contratos de comunicación para el diálogo modal de creación y edición.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * - `existingSections`: Se le pasa la lista de secciones existentes al modal
 *   para que su sub-presenter pueda calcular en tiempo real qué aulas físicas
 *   están ocupadas en el turno seleccionado y filtrarlas fuera del combo.
 * ============================================================================
 */

/** Datos inyectados en el modal mediante `MAT_DIALOG_DATA` */
export interface GradesSectionsSaveDialogData {
  /** Modo de apertura: 'create' (nueva sección) o 'edit' (modificación) */
  readonly mode: 'create' | 'edit';
  /** Datos iniciales en modo edición */
  readonly gradeSection?: {
    readonly id: string;
    readonly gradeId: string;
    readonly sectionId: string;
    readonly classroomId?: string;
    readonly shift: string;
    readonly maxCapacity: number;
    readonly enabled: boolean;
  };
  /** Lista completa de secciones existentes para validar conflicto de aulas por turno */
  readonly existingSections?: readonly GradeSectionItem[];
}

/** Carga útil emitida por el formulario al guardar hacia la API */
export interface GradesSectionsSavePayload {
  readonly grade: string;
  readonly section: string;
  readonly classroom?: string;
  readonly shift: string;
  readonly maxCapacity: number;
  readonly academicYear?: string;
  readonly enabled?: boolean;
}
