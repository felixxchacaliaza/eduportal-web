import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../shared/class/form-model';

/**
 * ============================================================================
 * AttendanceFormModel
 * ============================================================================
 * Modelo reactivo de controles de cabecera para el registro de asistencia diaria.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
export class AttendanceFormModel extends FormModel {
  /** Fecha seleccionada para la toma de asistencia (YYYY-MM-DD) */
  date = [new Date().toISOString().substring(0, 10), [Validators.required]];

  /** Identificador de la sección académica */
  gradeSection = ['', [Validators.required]];

  /** Año lectivo actual */
  academicYear = ['2026', [Validators.required]];
}
