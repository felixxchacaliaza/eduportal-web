import {
  Component,
  ChangeDetectionStrategy,
  input,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EvaluationPeriodConfig } from '../../models/evaluation-period-config.interface';

/**
 * ============================================================================
 * GradeBookFiltersComponent (Dumb Component)
 * ============================================================================
 * Barra de selectores de salón, asignatura, indicadores de candados isOpen
 * y botón de persistencia masiva transaccional.
 * ============================================================================
 */
@Component({
  selector: 'app-grade-book-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './grade-book-filters.component.html',
  styleUrls: ['./grade-book-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GradeBookFiltersComponent {
  public readonly gradeSections = input.required<readonly any[]>();
  public readonly subjects = input.required<readonly any[]>();
  public readonly selectedGradeSectionId = input<string>('');
  public readonly selectedSubjectId = input<string>('');
  public readonly periodConfigs = input<readonly EvaluationPeriodConfig[]>([]);
  public readonly isSaving = input<boolean>(false);
  public readonly hasData = input<boolean>(false);

  public readonly gradeSectionChange = output<string>();
  public readonly subjectChange = output<string>();
  public readonly save = output<void>();

  public onGradeSectionSelect(id: string): void {
    this.gradeSectionChange.emit(id);
  }

  public onSubjectSelect(id: string): void {
    this.subjectChange.emit(id);
  }

  public onSave(): void {
    this.save.emit();
  }
}
