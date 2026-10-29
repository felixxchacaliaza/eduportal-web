import {
  Component,
  ChangeDetectionStrategy,
  input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormArray,
  FormGroup,
  FormControl
} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EvaluationPeriodConfig } from '../../models/evaluation-period-config.interface';
import { ScoreInputComponent } from '../score-input/score-input.component';
import { ScoreColorDirective } from '../../../../../shared/directives/score-color/score-color.directive';
import { GradeStatusPipe } from '../../../../../shared/pipes/grade-status/grade-status.pipe';

/**
 * ============================================================================
 * GradeBookMatrixComponent (Dumb Component)
 * ============================================================================
 * Tabla densa bidimensional para el vaciado masivo de notas vigesimales MINEDU.
 *
 * @remarks
 * Proyecta:
 * - Filas de estudiantes matriculados.
 * - Columnas dinámicas de bimestres con `<app-score-input>`.
 * - Integración con `ScoreColorDirective` y `GradeStatusPipe` (Senior Boost 06.1.1).
 * ============================================================================
 */
@Component({
  selector: 'app-grade-book-matrix',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ScoreInputComponent,
    ScoreColorDirective,
    GradeStatusPipe
  ],
  templateUrl: './grade-book-matrix.component.html',
  styleUrls: ['./grade-book-matrix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GradeBookMatrixComponent {
  public readonly rows = input.required<FormArray<FormGroup>>();
  public readonly periodConfigs = input.required<readonly EvaluationPeriodConfig[]>();
  public readonly isLoading = input<boolean>(false);

  /**
   * Obtiene de forma segura el FormControl de puntaje para un periodo dado.
   */
  public getPeriodScoreControl(row: FormGroup, periodNum: number): FormControl<number | null> {
    const periodsArray = row.get('periods') as FormArray<FormGroup>;
    const group = periodsArray.controls.find(
      ctrl => ctrl.get('period')?.value === periodNum
    );
    return (group?.get('score') as FormControl<number | null>) || new FormControl(null);
  }
}
