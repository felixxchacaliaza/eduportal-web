import { Injectable, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WorkerService } from '../../services/worker.service';
import { WorkerSaveDialogData } from './form/models/worker-save-dialog.interface';
import { ICreateWorkerRequestDto, IWorker } from '../../models';

/**
 * ============================================================================
 * WorkerSaveDialogPresenter
 * ============================================================================
 * Presentador scoped para el modal general de trabajadores administrativos.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class WorkerSaveDialogPresenter {
  private readonly dialogRef = inject(MatDialogRef<any>);
  public readonly data = inject<WorkerSaveDialogData>(MAT_DIALOG_DATA);
  private readonly workerService = inject(WorkerService);

  public readonly isSaving = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  /**
   * Guarda o actualiza un trabajador y cierra el diálogo retornando la entidad.
   */
  public async save(payload: ICreateWorkerRequestDto): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      let savedWorker: IWorker;
      if (this.data?.mode === 'edit' && this.data.worker) {
        savedWorker = await this.workerService.updateWorker(this.data.worker.id, payload);
      } else {
        savedWorker = await this.workerService.createWorker(payload);
      }
      this.dialogRef.close(savedWorker);
    } catch (err: any) {
      console.error('Error al guardar trabajador:', err);
      this.errorMessage.set(err?.error?.message || err?.message || 'Error al procesar el registro del trabajador');
    } finally {
      this.isSaving.set(false);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
