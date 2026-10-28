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
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { EnrollmentSaveDialogFormPresenter } from './enrollment-save-dialog-form.presenter';
import { IEnrollStudentRequestDto, IStudent, IGradeSectionSummary } from '../../../models';

/**
 * ============================================================================
 * EnrollmentSaveDialogFormComponent
 * ============================================================================
 * Formulario desacoplado para la selección de salón y registro de matrícula.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-enrollment-save-dialog-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
  ],
  providers: [EnrollmentSaveDialogFormPresenter],
  templateUrl: './enrollment-save-dialog-form.component.html',
  styleUrl: './enrollment-save-dialog-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentSaveDialogFormComponent {
  public readonly presenter = inject(EnrollmentSaveDialogFormPresenter);

  public readonly student = input.required<IStudent>();
  public readonly sections = input.required<IGradeSectionSummary[]>();
  public readonly isSaving = input<boolean>(false);

  public readonly formSubmit = output<IEnrollStudentRequestDto>();
  public readonly formCancel = output<void>();

  constructor() {
    effect(() => {
      const sectionList = this.sections();
      this.presenter.initialize(sectionList);
    });
  }

  public onSubmit(): void {
    if (this.presenter.isValid()) {
      const studentId = this.student().id;
      this.formSubmit.emit(this.presenter.getPayload(studentId));
    }
  }

  public onCancel(): void {
    this.formCancel.emit();
  }
}
