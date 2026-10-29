import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IncidentSaveDialogFormModel } from './models/incident-save-dialog-form.model';
import { INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT } from './models/incident-save-dialog-form.model.constant';

/**
 * ============================================================================
 * IncidentSaveDialogFormPresenter
 * ============================================================================
 * Presentador de formulario desacoplado para el modal de incidencias.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class IncidentSaveDialogFormPresenter {
  private readonly fb = inject(FormBuilder);

  public readonly formModel = new IncidentSaveDialogFormModel();
  public readonly constant = INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT;

  public readonly typeOptions = Object.freeze([
    { value: 'DEMERITO', label: 'Demérito / Falta Conductual' },
    { value: 'MERITO', label: 'Mérito / Felicitación' },
    { value: 'ATENCION_PSICOLOGICA', label: 'Atención Psicológica / Tutoría' },
    { value: 'CITACION_APODERADO', label: 'Citación a Apoderado' }
  ]);

  public readonly severityOptions = Object.freeze([
    { value: 'LEVE', label: 'Leve' },
    { value: 'MODERADA', label: 'Moderada' },
    { value: 'GRAVE', label: 'Grave' }
  ]);

  public readonly form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: this.formModel.title,
      type: this.formModel.type,
      severity: this.formModel.severity,
      description: this.formModel.description,
      actionTaken: this.formModel.actionTaken
    });
  }

  public get isValid(): boolean {
    return this.form.valid;
  }

  public get isDirty(): boolean {
    return this.form.dirty;
  }

  public reset(): void {
    this.form.reset({
      title: '',
      type: 'DEMERITO',
      severity: 'LEVE',
      description: '',
      actionTaken: ''
    });
  }

  public getRawPayload(): {
    title: string;
    type: 'DEMERITO' | 'MERITO' | 'ATENCION_PSICOLOGICA' | 'CITACION_APODERADO';
    severity: 'LEVE' | 'MODERADA' | 'GRAVE';
    description: string;
    actionTaken: string;
  } {
    return this.form.getRawValue();
  }
}
