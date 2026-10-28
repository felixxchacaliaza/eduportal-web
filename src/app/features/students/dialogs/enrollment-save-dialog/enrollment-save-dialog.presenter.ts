import { Injectable, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnrollmentService } from '../../services/enrollment.service';
import { EnrollmentSaveDialogData } from './form/models/enrollment-save-dialog-form.interface';
import { IEnrollStudentRequestDto, IEnrollment, IGradeSectionSummary } from '../../models';

/**
 * ============================================================================
 * EnrollmentSaveDialogPresenter
 * ============================================================================
 * Presentador scoped para el modal general de matrícula anual.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class EnrollmentSaveDialogPresenter {
  private readonly dialogRef = inject(MatDialogRef<any>);
  public readonly data = inject<EnrollmentSaveDialogData>(MAT_DIALOG_DATA);
  private readonly enrollmentService = inject(EnrollmentService);

  public readonly isLoadingSections = signal<boolean>(false);
  public readonly isSaving = signal<boolean>(false);
  public readonly sections = signal<IGradeSectionSummary[]>([]);
  public readonly errorMessage = signal<string | null>(null);

  /**
   * Carga las secciones aperturadas para el año académico.
   */
  public async loadSections(academicYear = '2026'): Promise<IGradeSectionSummary[]> {
    this.isLoadingSections.set(true);
    this.errorMessage.set(null);
    try {
      const data = await this.enrollmentService.getGradeSections(academicYear);
      this.sections.set(data);
      return data;
    } catch (err: any) {
      console.error('Error al cargar salones escolares:', err);
      this.errorMessage.set(err?.error?.message || err?.message || 'Error al obtener salones escolares');
      return [];
    } finally {
      this.isLoadingSections.set(false);
    }
  }

  /**
   * Ejecuta la matrícula anual del alumno.
   */
  public async enroll(payload: IEnrollStudentRequestDto): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      const result: IEnrollment = await this.enrollmentService.enrollStudent(payload);
      this.dialogRef.close(result);
    } catch (err: any) {
      console.error('Error al registrar matrícula:', err);
      this.errorMessage.set(err?.error?.message || err?.message || 'Error al procesar la matrícula');
    } finally {
      this.isSaving.set(false);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
