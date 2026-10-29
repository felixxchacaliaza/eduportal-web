import { IBulkEvaluationItem } from './bulk-evaluation-item.interface';

/**
 * ============================================================================
 * BulkEvaluationRequestDto Interface
 * ============================================================================
 * Contrato de carga útil para persistencia en lote hacia PUT /api/evaluations/bulk-update.
 * ============================================================================
 */
export interface BulkEvaluationRequestDto {
  readonly evaluations: readonly IBulkEvaluationItem[];
}
