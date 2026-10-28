import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EnrollmentSaveDialogFormComponent } from './form/enrollment-save-dialog-form.component';
import { EnrollmentSaveDialogPresenter } from './enrollment-save-dialog.presenter';
import { IEnrollStudentRequestDto } from '../../models';

/**
 * ============================================================================
 * EnrollmentSaveDialogComponent
 * ============================================================================
 * Contenedor del Diálogo Modal (Dialog Shell) para registrar matrícula anual.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-enrollment-save-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    EnrollmentSaveDialogFormComponent,
  ],
  providers: [EnrollmentSaveDialogPresenter],
  templateUrl: './enrollment-save-dialog.component.html',
  styleUrl: './enrollment-save-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentSaveDialogComponent implements OnInit {
  public readonly presenter = inject(EnrollmentSaveDialogPresenter);

  public ngOnInit(): void {
    this.presenter.loadSections();
  }

  public onFormSubmit(payload: IEnrollStudentRequestDto): void {
    this.presenter.enroll(payload);
  }

  public onFormCancel(): void {
    this.presenter.close();
  }
}
