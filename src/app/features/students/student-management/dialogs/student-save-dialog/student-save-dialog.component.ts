import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StudentSaveDialogFormComponent } from './form/student-save-dialog-form.component';
import { StudentSaveDialogPresenter } from './student-save-dialog.presenter';
import { ICreateStudentRequestDto } from '../../models';

/**
 * ============================================================================
 * StudentSaveDialogComponent
 * ============================================================================
 * Contenedor del Diálogo Modal (Dialog Shell) para crear y editar estudiantes.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-student-save-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    StudentSaveDialogFormComponent,
  ],
  providers: [StudentSaveDialogPresenter],
  templateUrl: './student-save-dialog.component.html',
  styleUrl: './student-save-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentSaveDialogComponent {
  public readonly presenter = inject(StudentSaveDialogPresenter);

  public onFormSubmit(payload: ICreateStudentRequestDto): void {
    this.presenter.save(payload);
  }

  public onFormCancel(): void {
    this.presenter.close();
  }
}
