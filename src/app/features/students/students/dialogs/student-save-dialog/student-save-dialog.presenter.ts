import { Injectable, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentService } from '../../services/student.service';
import { StudentSaveDialogData } from './form/models/student-save-dialog-form.interface';
import { ICreateStudentRequestDto, IStudent } from '../../models';

/**
 * ============================================================================
 * StudentSaveDialogPresenter
 * ============================================================================
 * Presentador scoped para el modal general de creación y edición de alumnos.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class StudentSaveDialogPresenter {
  private readonly dialogRef = inject(MatDialogRef<any>);
  public readonly data = inject<StudentSaveDialogData>(MAT_DIALOG_DATA);
  private readonly studentService = inject(StudentService);

  public readonly isSaving = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  /**
   * Guarda o actualiza un estudiante y cierra el diálogo retornando el resultado.
   */
  public async save(payload: ICreateStudentRequestDto): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      let savedStudent: IStudent;
      if (this.data.mode === 'edit' && this.data.student) {
        savedStudent = await this.studentService.updateStudent(this.data.student.id, payload);
      } else {
        savedStudent = await this.studentService.createStudent(payload);
      }
      this.dialogRef.close(savedStudent);
    } catch (err: any) {
      console.error('Error al guardar estudiante:', err);
      this.errorMessage.set(err?.error?.message || err?.message || 'Error al procesar la solicitud');
    } finally {
      this.isSaving.set(false);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
