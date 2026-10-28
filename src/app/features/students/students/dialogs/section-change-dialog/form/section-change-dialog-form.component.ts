import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SectionChangeDialogFormPresenter } from './section-change-dialog-form.presenter';
import { IStudent, IGradeSectionSummary } from '../../../models';

/**
 * ============================================================================
 * SectionChangeDialogFormComponent
 * ============================================================================
 * Formulario desacoplado para el cambio y traslado de sección escolar.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-section-change-dialog-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  providers: [SectionChangeDialogFormPresenter],
  templateUrl: './section-change-dialog-form.component.html',
  styleUrl: './section-change-dialog-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionChangeDialogFormComponent {
  public readonly presenter = inject(SectionChangeDialogFormPresenter);

  public readonly student = input.required<IStudent>();
  public readonly sections = input.required<IGradeSectionSummary[]>();
  public readonly isSaving = input<boolean>(false);

  public readonly formSubmit = output<string>();
  public readonly formCancel = output<void>();

  constructor() {
    effect(() => {
      const sectionList = this.sections();
      const currentSectionId = this.getCurrentGradeSectionId();
      this.presenter.initialize(sectionList, currentSectionId);
    });
  }

  public getCurrentGradeSectionId(): string {
    const enrollment = this.student().currentEnrollment;
    if (!enrollment) return '';
    const gs = enrollment.gradeSection;
    if (typeof gs === 'object' && gs !== null) {
      return (gs as any).id || (gs as any)._id || '';
    }
    return String(gs || '');
  }

  public getCurrentSectionName(): string {
    const enrollment = this.student().currentEnrollment;
    if (!enrollment) return 'Sin salón asignado';
    const gs = enrollment.gradeSection as any;
    if (typeof gs === 'object' && gs !== null) {
      const gradeDesc = gs.grade?.description || gs.grade?.name || 'Grado';
      const secName = gs.section?.name || '';
      const shift = gs.shift || '';
      return `${gradeDesc} "${secName}" (${shift})`;
    }
    return 'Salón actual';
  }

  public onSubmit(): void {
    if (this.presenter.isValid()) {
      this.formSubmit.emit(this.presenter.getSelectedSectionId());
    }
  }

  public onCancel(): void {
    this.formCancel.emit();
  }
}
