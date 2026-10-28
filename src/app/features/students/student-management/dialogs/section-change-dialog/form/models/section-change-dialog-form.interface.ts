import { IStudent } from '../../../../models';

/**
 * ============================================================================
 * SectionChangeDialogData
 * ============================================================================
 * Contrato de parámetros de entrada para el diálogo de cambio de sección.
 * Regla: 1 contrato por archivo.
 * ============================================================================
 */
export interface SectionChangeDialogData {
  student: IStudent;
}
