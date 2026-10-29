import { Injectable, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnrollmentService } from '../../services/enrollment.service';
import { SectionChangeDialogData } from './form/models/section-change-dialog-form.interface';
import { IEnrollment, IGradeSectionSummary } from '../../models';

/**
 * ============================================================================
 * SectionChangeDialogPresenter
 * ============================================================================
 * Presentador scoped para el modal de cambio de sección escolar.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class SectionChangeDialogPresenter {
  private readonly dialogRef = inject(MatDialogRef<any>);
  public readonly data = inject<SectionChangeDialogData>(MAT_DIALOG_DATA);
  private readonly enrollmentService = inject(EnrollmentService);

  public readonly isLoadingSections = signal<boolean>(false);
  public readonly isSaving = signal<boolean>(false);
  public readonly sections = signal<IGradeSectionSummary[]>([]);
  public readonly errorMessage = signal<string | null>(null);

  /**
   * Carga las secciones aperturadas para el año escolar.
   */
  public async loadSections(academicYear = '2026'): Promise<IGradeSectionSummary[]> {
    this.isLoadingSections.set(true);
    this.errorMessage.set(null);
    try {
      const data = await this.enrollmentService.getActiveGradeSections(academicYear);
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
   * Ejecuta el traslado de sección de la matrícula activa.
   */
  public async changeSection(newSectionId: string): Promise<void> {
    const enrollment = this.data.student.currentEnrollment;
    const enrollmentId = enrollment ? ((enrollment as any).id || (enrollment as any)._id) : '';

    if (!enrollmentId) {
      this.errorMessage.set('No se encontró el identificador de matrícula del estudiante.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      const result: IEnrollment = await this.enrollmentService.changeSection(enrollmentId, newSectionId);
      this.dialogRef.close(result);
    } catch (err: any) {
      console.error('Error al cambiar de sección:', err);
      this.errorMessage.set(err?.error?.message || err?.message || 'Error al procesar el traslado');
    } finally {
      this.isSaving.set(false);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
