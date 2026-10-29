import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output
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
import { WorkerSaveDialogFormPresenter } from './worker-save-dialog-form.presenter';
import { ICreateWorkerRequestDto, IWorker } from '../../../models';

/**
 * ============================================================================
 * WorkerSaveDialogFormComponent
 * ============================================================================
 * Componente presentacional desacoplado para el formulario de trabajador administrativo.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-worker-save-dialog-form',
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
    MatTooltipModule
  ],
  providers: [WorkerSaveDialogFormPresenter],
  templateUrl: './worker-save-dialog-form.component.html',
  styleUrl: './worker-save-dialog-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkerSaveDialogFormComponent {
  public readonly presenter = inject(WorkerSaveDialogFormPresenter);

  public readonly mode = input<'create' | 'edit'>('create');
  public readonly initialData = input<IWorker | null | undefined>(null);
  public readonly isSaving = input<boolean>(false);

  public readonly formSubmit = output<ICreateWorkerRequestDto>();
  public readonly formCancel = output<void>();

  constructor() {
    effect(() => {
      const worker = this.initialData();
      this.presenter.initialize(worker || undefined);
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
}
