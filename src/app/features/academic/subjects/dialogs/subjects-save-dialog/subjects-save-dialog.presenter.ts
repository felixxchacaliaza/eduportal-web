import { Injectable, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubjectService } from '../../../../../core/api';
import { SubjectsSaveDialogComponent } from './subjects-save-dialog.component';
import { SubjectsSaveDialogData } from './models/interfaces/subjects-save-dialog-data.interface';
import { SubjectsSaveFormPayload } from './models/interfaces/subjects-save-form-payload.interface';

/**
 * ============================================================================
 * SubjectsSaveDialogPresenter
 * ============================================================================
 * Presentador de persistencia y estado para el diálogo modal de asignaturas.
 *
 * @remarks
 * Implementa el patrón **Autonomous Dialog Presenter**:
 * - **Autonomía:** El diálogo asume la responsabilidad de comunicarse con la API
 *   a través de {@link SubjectService}, evitando delegar errores o spinners a la vista padre.
 * - **Tolerancia a Fallos:** Si el backend responde con un error de validación o caída de red,
 *   el diálogo no se cierra, preservando la información del usuario y desplegando el error.
 * - **Notificación:** Al concluir exitosamente, emite `this.dialogRef.close(true)` para que
 *   la vista principal refresque su catálogo maestro.
 * ============================================================================
 */
@Injectable()
export class SubjectsSaveDialogPresenter {
  /** Servicio para consumo de endpoints REST de asignaturas */
  private readonly subjectService = inject(SubjectService);

  /** Referencia para el control de apertura y cierre del diálogo modal */
  private readonly dialogRef = inject(MatDialogRef<SubjectsSaveDialogComponent>);

  /** Datos de contexto inyectados (modo 'create' o 'edit', datos iniciales y áreas) */
  public readonly data: SubjectsSaveDialogData = inject(MAT_DIALOG_DATA);

  /** Señal que indica si una petición de guardado está en curso en la red */
  public readonly isSaving = signal<boolean>(false);

  /** Señal con el mensaje de error para retroalimentación visual en caso de fallo */
  public readonly errorMessage = signal<string | null>(null);

  /**
   * Persiste la asignatura en la base de datos a través de la API.
   *
   * @param payload - Datos validados y normalizados del formulario.
   * @returns Promesa que se resuelve al finalizar la llamada HTTP.
   */
  public async save(payload: SubjectsSaveFormPayload): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      if (this.data.mode === 'create') {
        await this.subjectService.createSubject({
          name: payload.name,
          area: payload.area,
          weeklyHours: payload.weeklyHours,
          description: payload.description,
          enabled: true,
        });
      } else if (this.data.mode === 'edit' && this.data.subject?.id) {
        await this.subjectService.updateSubject(this.data.subject.id, {
          name: payload.name,
          area: payload.area,
          weeklyHours: payload.weeklyHours,
          description: payload.description,
          enabled: this.data.subject.status === 'Activa',
        });
      }

      // Notificación de éxito al componente contenedor principal
      this.dialogRef.close(true);
    } catch (error: any) {
      console.error('Error al guardar asignatura en el backend:', error);
      const serverMessage =
        error?.error?.message ||
        error?.message ||
        'Ocurrió un error al procesar la solicitud en el servidor. Intente nuevamente.';
      this.errorMessage.set(serverMessage);
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Cierra el diálogo modal sin guardar ningún cambio.
   */
  public cancel(): void {
    this.dialogRef.close(false);
  }
}
