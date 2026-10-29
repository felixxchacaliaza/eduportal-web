import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * IncidentSaveDialogFormModel
 * ============================================================================
 * Modelo reactivo de controles para el formulario de incidencias de convivencia.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
export class IncidentSaveDialogFormModel extends FormModel {
  /** Asunto o título breve de la incidencia */
  title = ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]];

  /** Tipo de incidencia escolar */
  type = ['DEMERITO', [Validators.required]];

  /** Severidad o grado de impacto */
  severity = ['LEVE', [Validators.required]];

  /** Descripción detallada de los hechos */
  description = ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]];

  /** Medida correctiva o acción aplicada por el docente/tutor */
  actionTaken = ['', [Validators.maxLength(300)]];
}
