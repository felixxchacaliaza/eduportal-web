import { Injectable, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IncidentService } from '../../services/incident.service';
import { IncidentSaveDialogData } from './form/models/incident-save-dialog.interface';
import { IIncident } from '../../models/incident.interface';

/**
 * ============================================================================
 * IncidentSaveDialogPresenter
 * ============================================================================
 * Presentador Scoped del Diálogo Modal para el Registro de Incidencias.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class IncidentSaveDialogPresenter {
  private readonly dialogRef = inject(MatDialogRef<any>);
  public readonly data = inject<IncidentSaveDialogData>(MAT_DIALOG_DATA);
  private readonly incidentService = inject(IncidentService);

  public readonly isSaving = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  /**
   * Guarda la incidencia en el backend a través del servicio reactivo.
   */
  public async save(formValue: {
    title: string;
    type: 'DEMERITO' | 'MERITO' | 'ATENCION_PSICOLOGICA' | 'CITACION_APODERADO';
    severity: 'LEVE' | 'MODERADA' | 'GRAVE';
    description: string;
    actionTaken: string;
  }): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      const randomCode = `INC-${Math.floor(100 + Math.random() * 899)}`;
      const payload: Partial<IIncident> = {
        code: randomCode,
        student: this.data.studentId,
        gradeSection: this.data.gradeSectionId,
        academicYear: this.data.academicYear || '2026',
        title: formValue.title,
        type: formValue.type,
        severity: formValue.severity,
        description: formValue.description,
        actionTaken: formValue.actionTaken,
        reportedBy: '6ae22a93f42eeb593b08a2a9',
        incidentDate: new Date().toISOString(),
        status: 'ABIERTA',
        enabled: true
      };

      const result = await this.incidentService.create(payload);
      this.dialogRef.close(result);
    } catch (err: any) {
      console.error('Error al registrar la incidencia:', err);
      this.errorMessage.set(
        err?.error?.message || err?.message || 'Error inesperado al registrar la incidencia'
      );
    } finally {
      this.isSaving.set(false);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
