/**
 * ============================================================================
 * EvaluationPeriodConfig Interface
 * ============================================================================
 * Configuración institucional de un periodo escolar según regla MINEDU RUL-004.
 * ============================================================================
 */
export interface EvaluationPeriodConfig {
  readonly period: number;
  readonly name: string;
  readonly weight: number;
  readonly isOpen: boolean;
}
