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
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentSaveDialogFormPresenter } from './student-save-dialog-form.presenter';
import { ICreateStudentRequestDto, IStudent } from '../../../models';

/**
 * ============================================================================
 * StudentSaveDialogFormComponent
 * ============================================================================
 * Componente presentacional desacoplado para el formulario de estudiante y apoderados.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-student-save-dialog-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  providers: [StudentSaveDialogFormPresenter],
  templateUrl: './student-save-dialog-form.component.html',
  styleUrl: './student-save-dialog-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentSaveDialogFormComponent {
  public readonly presenter = inject(StudentSaveDialogFormPresenter);

  public readonly mode = input<'create' | 'edit'>('create');
  public readonly initialData = input<IStudent | null | undefined>(null);
  public readonly isSaving = input<boolean>(false);

  public readonly formSubmit = output<ICreateStudentRequestDto>();
  public readonly formCancel = output<void>();

  constructor() {
    effect(() => {
      const student = this.initialData();
      if (student) {
        this.presenter.initialize(student);
      } else {
        this.presenter.initialize();
      }
    });
  }

  public onSubmit(): void {
    if (this.presenter.isValid()) {
      this.formSubmit.emit(this.presenter.getPayload());
    }
  }

  public onCancel(): void {
    this.formCancel.emit();
  }

  public addGuardian(): void {
    this.presenter.addGuardian();
  }

  public removeGuardian(index: number): void {
    this.presenter.removeGuardian(index);
  }

  public setPrimaryGuardian(index: number): void {
    this.presenter.setPrimaryGuardian(index);
  }
}
