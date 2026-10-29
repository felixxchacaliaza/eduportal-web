import { EvaluationPeriodScore } from './evaluation-period-score.interface';

/**
 * ============================================================================
 * IBulkEvaluationItem Interface
 * ============================================================================
 * Ítem de actualización individual dentro del lote masivo de calificaciones.
 * ============================================================================
 */
export interface IBulkEvaluationItem {
  readonly id: string;
  readonly periods: readonly EvaluationPeriodScore[];
  readonly observation?: string;
}
