import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * EnrollmentSaveDialogFormModel
 * ============================================================================
 * Modelo reactivo de controles para la matrícula anual de un estudiante.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
export class EnrollmentSaveDialogFormModel extends FormModel {
  /** Salón escolar seleccionado (GradeSection ObjectId) */
  gradeSection = ['', [Validators.required]];

  /** Año lectivo escolar */
  academicYear = ['2026', [Validators.required, Validators.pattern(/^\d{4}$/)]];

  /** Condición jurídica de la matrícula (MATRICULADO, TRASLADADO, RETIRADO) */
  status = ['MATRICULADO', [Validators.required]];

  /** Tipo de matrícula (REGULAR, INGRESANTE, TRASLADO) */
  enrollmentType = ['REGULAR', [Validators.required]];

  /** Observaciones o condicionamientos académicos */
  observation = [''];
}
