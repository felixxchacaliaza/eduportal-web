/**
 * ============================================================================
 * EvaluationPeriodScore Interface
 * ============================================================================
 * Subdocumento que representa el puntaje obtenido por un alumno en un periodo específico.
 * ============================================================================
 */
export interface EvaluationPeriodScore {
  readonly period: number;
  readonly score: number | null;
}
