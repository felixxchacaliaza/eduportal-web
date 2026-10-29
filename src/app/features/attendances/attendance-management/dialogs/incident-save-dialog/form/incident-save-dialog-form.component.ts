import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IncidentSaveDialogFormPresenter } from './incident-save-dialog-form.presenter';

/**
 * ============================================================================
 * IncidentSaveDialogFormComponent
 * ============================================================================
 * Formulario Dumb desacoplado para el registro de incidencias escolares.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-incident-save-dialog-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [IncidentSaveDialogFormPresenter],
  templateUrl: './incident-save-dialog-form.component.html',
  styleUrl: './incident-save-dialog-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentSaveDialogFormComponent {
  public readonly presenter = inject(IncidentSaveDialogFormPresenter);

  @Input() public isSubmitting = false;

  @Output() public readonly formSubmit = new EventEmitter<ReturnType<IncidentSaveDialogFormPresenter['getRawPayload']>>();
  @Output() public readonly formCancel = new EventEmitter<void>();

  public onSubmit(): void {
    if (this.presenter.isValid) {
      this.formSubmit.emit(this.presenter.getRawPayload());
    }
  }

  public onCancel(): void {
    this.formCancel.emit();
  }
}
