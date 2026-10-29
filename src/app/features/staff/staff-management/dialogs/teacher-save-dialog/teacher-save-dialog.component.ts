import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TeacherSaveDialogFormComponent } from './form/teacher-save-dialog-form.component';
import { TeacherSaveDialogPresenter } from './teacher-save-dialog.presenter';
import { ICreateTeacherRequestDto } from '../../models';

/**
 * ============================================================================
 * TeacherSaveDialogComponent
 * ============================================================================
 * Diálogo modal (Dialog Shell) para registrar y actualizar docentes.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-teacher-save-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    TeacherSaveDialogFormComponent
  ],
  providers: [TeacherSaveDialogPresenter],
  templateUrl: './teacher-save-dialog.component.html',
  styleUrl: './teacher-save-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherSaveDialogComponent {
  public readonly presenter = inject(TeacherSaveDialogPresenter);

  public onFormSubmit(payload: ICreateTeacherRequestDto): void {
    this.presenter.save(payload);
  }

  public onFormCancel(): void {
    this.presenter.close();
  }
}
