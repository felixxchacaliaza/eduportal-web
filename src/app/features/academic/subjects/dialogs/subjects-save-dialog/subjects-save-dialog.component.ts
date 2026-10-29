import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SubjectsSaveDialogFormComponent } from './form/subjects-save-dialog-form.component';
import { SubjectsSaveDialogPresenter } from './subjects-save-dialog.presenter';
import { SubjectsSaveFormPayload } from './models/interfaces/subjects-save-form-payload.interface';

/**
 * ============================================================================
 * SubjectsSaveDialogComponent
 * ============================================================================
 * Contenedor del Diálogo Modal (Dialog Shell) para la creación y edición de asignaturas.
 *
 * @remarks
 * Implementa el patrón **Dialog Shell / Autonomous Modal Component**:
 * - **Presentación:** Aloja el marco visual (`mat-dialog-title`, botón 'X', `mat-dialog-content`).
 * - **Persistencia Autónoma:** Delega la llamada a endpoints, spinners y captura de errores
 *   a {@link SubjectsSaveDialogPresenter}.
 * - **Formulario Especializado:** Hospeda al subcomponente desacoplado {@link SubjectsSaveDialogFormComponent}.
 * - **Retroalimentación:** Despliega una barra de progreso mientras persiste y un banner de error si la API falla.
 * ============================================================================
 */
@Component({
  selector: 'app-subjects-save-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    SubjectsSaveDialogFormComponent,
  ],
  providers: [SubjectsSaveDialogPresenter],
  templateUrl: './subjects-save-dialog.component.html',
  styleUrl: './subjects-save-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsSaveDialogComponent {
  /** Presentador del diálogo que gestiona la llamada a la API y el ciclo de vida del modal */
  public readonly presenter = inject(SubjectsSaveDialogPresenter);

  /**
   * Invoca la persistencia en el backend a través del presenter.
   *
   * @param payload - Datos validados emitidos por el formulario.
   */
  public onFormSubmit(payload: SubjectsSaveFormPayload): void {
    this.presenter.save(payload);
  }

  /**
   * Cancela la operación y cierra el diálogo modal sin emitir cambios.
   */
  public onFormCancel(): void {
    this.presenter.cancel();
  }
}