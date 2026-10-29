import { Injectable, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeacherService } from '../../services/teacher.service';
import { TeacherSaveDialogData } from './form/models/teacher-save-dialog.interface';
import { ICreateTeacherRequestDto, ITeacher } from '../../models';

/**
 * ============================================================================
 * TeacherSaveDialogPresenter
 * ============================================================================
 * Presentador scoped para el modal general de registro de profesores.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class TeacherSaveDialogPresenter {
  private readonly dialogRef = inject(MatDialogRef<any>);
  public readonly data = inject<TeacherSaveDialogData>(MAT_DIALOG_DATA);
  private readonly teacherService = inject(TeacherService);

  public readonly isSaving = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  /**
   * Guarda o actualiza un profesor y cierra el diálogo retornando la entidad.
   */
  public async save(payload: ICreateTeacherRequestDto): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      let savedTeacher: ITeacher;
      if (this.data?.mode === 'edit' && this.data.teacher) {
        savedTeacher = await this.teacherService.updateTeacher(this.data.teacher.id, payload);
      } else {
        savedTeacher = await this.teacherService.createTeacher(payload);
      }
      this.dialogRef.close(savedTeacher);
    } catch (err: any) {
      console.error('Error al guardar docente:', err);
      this.errorMessage.set(err?.error?.message || err?.message || 'Error al procesar el registro del docente');
    } finally {
      this.isSaving.set(false);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
