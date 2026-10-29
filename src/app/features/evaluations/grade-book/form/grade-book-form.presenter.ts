import { Injectable, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators
} from '@angular/forms';
import { GradeBookFormModel } from './models/grade-book-form.model';
import { IEvaluation } from '../models/evaluation.interface';
import { EvaluationPeriodConfig } from '../models/evaluation-period-config.interface';
import { BulkEvaluationRequestDto } from '../models/bulk-evaluation-request.dto';

/**
 * ============================================================================
 * GradeBookFormPresenter
 * ============================================================================
 * Presentador desacoplado para la matriz reactiva bidimensional de calificaciones.
 *
 * @remarks
 * Encapsula:
 * - Construcción de FormArray 2D (Filas: Alumnos, Columnas: Periodos MINEDU).
 * - Aplicación dinámica de candados `isOpen: false` deshabilitando controles.
 * - Recálculo vigesimal en caliente (`Math.round`) y chips APROBADO/DESAPROBADO.
 * - Extracción íntegra transaccional mediante `.getRawValue()`.
 * ============================================================================
 */
@Injectable()
export class GradeBookFormPresenter {
  private readonly fb = inject(FormBuilder);

  /** Formulario raíz de filtros y metadatos */
  public readonly filterForm: FormGroup = this.fb.group(new GradeBookFormModel());

  /** Matriz reactiva bidimensional de evaluaciones */
  public readonly rows: FormArray<FormGroup> = this.fb.array<FormGroup>([]);

  /**
   * Limpia y puebla la matriz 2D con los estudiantes y periodos normados.
   */
  public populate(
    evaluations: readonly IEvaluation[],
    periodConfigs: readonly EvaluationPeriodConfig[]
  ): void {
    this.rows.clear();

    for (const item of evaluations) {
      const student = item.student;
      const person = student?.person;
      const fullName = person
        ? `${person.lastName || ''} ${person.firstName || ''}`.trim()
        : student?.code || 'Estudiante';

      const periodsArray = this.fb.array<FormGroup>([]);

      // Construir celdas de periodos en orden
      for (const config of periodConfigs) {
        const existingPeriod = item.periods.find(p => p.period === config.period);
        const initialScore = existingPeriod?.score ?? null;

        const periodGroup = this.fb.group({
          period: [config.period, [Validators.required]],
          score: [
            {
              value: initialScore,
              disabled: !config.isOpen
            },
            [Validators.min(0), Validators.max(20)]
          ]
        });

        // Escuchar mutaciones en caliente para recalcular promedio vigesimal
        periodGroup.get('score')?.valueChanges.subscribe(() => {
          this.recalculateRow(rowGroup, periodConfigs);
        });

        periodsArray.push(periodGroup);
      }

      const rowGroup = this.fb.group({
        id: [item.id, [Validators.required]],
        studentId: [student?.id || ''],
        studentCode: [student?.code || ''],
        studentDni: [person?.dni || ''],
        studentName: [fullName],
        periods: periodsArray,
        finalAverage: [item.finalAverage ?? null],
        status: [item.status || 'EN_CURSO'],
        observation: [item.observation || '']
      });

      this.rows.push(rowGroup);
    }
  }

  /**
   * Recalcula en caliente el promedio vigesimal y el estado del alumno en la fila.
   */
  public recalculateRow(
    row: FormGroup,
    periodConfigs: readonly EvaluationPeriodConfig[]
  ): void {
    const rawRow = row.getRawValue();
    const periodScores = (rawRow.periods || [])
      .map((p: any) => p.score)
      .filter((s: any) => s !== null && s !== undefined && s !== '' && !isNaN(Number(s)))
      .map((s: any) => Number(s));

    if (periodScores.length === 0) {
      row.patchValue(
        { finalAverage: null, status: 'EN_CURSO' },
        { emitEvent: false }
      );
      return;
    }

    // Regla MINEDU RUL-005: Promedio vigesimal redondeado al entero más cercano
    const sum = periodScores.reduce((acc: number, val: number) => acc + val, 0);
    const average = Math.round(sum / periodConfigs.length);

    const isAllGraded = periodScores.length === periodConfigs.length;
    let status: 'EN_CURSO' | 'APROBADO' | 'DESAPROBADO' = 'EN_CURSO';

    if (isAllGraded) {
      status = average >= 11 ? 'APROBADO' : 'DESAPROBADO';
    } else {
      status = average >= 11 ? 'APROBADO' : 'EN_CURSO';
    }

    row.patchValue(
      { finalAverage: average, status },
      { emitEvent: false }
    );
  }

  /**
   * Extrae la carga útil completa para persistencia mediante .getRawValue()
   * garantizando que los periodos deshabilitados por candado no se pierdan.
   */
  public getRawPayload(): BulkEvaluationRequestDto {
    const rawRows = this.rows.getRawValue();

    return {
      evaluations: rawRows.map((r: any) => ({
        id: r.id,
        periods: (r.periods || []).map((p: any) => ({
          period: Number(p.period),
          score: p.score !== null && p.score !== undefined && p.score !== ''
            ? Number(p.score)
            : null
        })),
        observation: r.observation || undefined
      }))
    };
  }
}
