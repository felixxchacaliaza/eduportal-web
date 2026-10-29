import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IncidentSaveDialogPresenter } from './incident-save-dialog.presenter';
import { IncidentSaveDialogFormComponent } from './form/incident-save-dialog-form.component';
import { IncidentSaveDialogFormPresenter } from './form/incident-save-dialog-form.presenter';

/**
 * ============================================================================
 * IncidentSaveDialogComponent
 * ============================================================================
 * Diálogo modal para registrar incidencias de conducta/disciplina escolar.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-incident-save-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    IncidentSaveDialogFormComponent
  ],
  providers: [IncidentSaveDialogPresenter],
  templateUrl: './incident-save-dialog.component.html',
  styleUrl: './incident-save-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentSaveDialogComponent {
  public readonly presenter = inject(IncidentSaveDialogPresenter);

  public onFormSubmit(payload: ReturnType<IncidentSaveDialogFormPresenter['getRawPayload']>): void {
    this.presenter.save(payload);
  }

  public onFormCancel(): void {
    this.presenter.close();
  }
}
