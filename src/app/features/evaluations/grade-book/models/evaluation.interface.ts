import { EvaluationPeriodScore } from './evaluation-period-score.interface';

/**
 * ============================================================================
 * IEvaluation Interface
 * ============================================================================
 * Contrato principal que representa el acta y registro de notas de un estudiante
 * para un salón y asignatura en un año escolar determinado.
 * ============================================================================
 */
export interface IEvaluation {
  readonly id: string;
  readonly code: string;
  readonly academicYear: string;
  readonly gradeSection: any;
  readonly subject: any;
  readonly student: {
    readonly id: string;
    readonly code?: string;
    readonly entryYear?: string;
    readonly person?: {
      readonly id: string;
      readonly dni: string;
      readonly firstName: string;
      readonly lastName: string;
      readonly gender?: string;
      readonly personalEmail?: string;
      readonly phone?: string;
    };
  };
  readonly teacher?: {
    readonly id: string;
    readonly code?: string;
    readonly academicDegree?: string;
    readonly specialty?: string;
    readonly person?: {
      readonly id: string;
      readonly dni: string;
      readonly firstName: string;
      readonly lastName: string;
    };
  };
  readonly periods: readonly EvaluationPeriodScore[];
  readonly finalAverage: number | null;
  readonly status: 'EN_CURSO' | 'APROBADO' | 'DESAPROBADO';
  readonly observation?: string;
  readonly enabled: boolean;
}
