import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * SectionChangeDialogFormModel
 * ============================================================================
 * Modelo de formulario reactivo para el cambio o traslado de sección escolar.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
export class SectionChangeDialogFormModel extends FormModel {
  /** Nueva sección escolar de destino (ObjectId) */
  gradeSection = ['', [Validators.required]];
}
