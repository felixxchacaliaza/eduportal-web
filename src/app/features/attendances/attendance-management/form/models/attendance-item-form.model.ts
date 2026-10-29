import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../shared/class/form-model';

/**
 * ============================================================================
 * AttendanceItemFormModel
 * ============================================================================
 * Modelo reactivo para cada fila individual de alumno en la matriz de asistencia.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
export class AttendanceItemFormModel extends FormModel {
  student = ['', [Validators.required]];
  studentCode = [''];
  studentName = [''];
  studentDni = [''];
  status = ['PRESENTE', [Validators.required]];
  observation = [''];
}
