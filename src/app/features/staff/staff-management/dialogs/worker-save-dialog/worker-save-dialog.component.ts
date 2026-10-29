import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WorkerSaveDialogFormComponent } from './form/worker-save-dialog-form.component';
import { WorkerSaveDialogPresenter } from './worker-save-dialog.presenter';
import { ICreateWorkerRequestDto } from '../../models';

/**
 * ============================================================================
 * WorkerSaveDialogComponent
 * ============================================================================
 * Diálogo modal (Dialog Shell) para registrar y actualizar trabajadores.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-worker-save-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    WorkerSaveDialogFormComponent
  ],
  providers: [WorkerSaveDialogPresenter],
  templateUrl: './worker-save-dialog.component.html',
  styleUrl: './worker-save-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkerSaveDialogComponent {
  public readonly presenter = inject(WorkerSaveDialogPresenter);

  public onFormSubmit(payload: ICreateWorkerRequestDto): void {
    this.presenter.save(payload);
  }

  public onFormCancel(): void {
    this.presenter.close();
  }
}
