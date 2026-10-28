import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * GuardianFormModel
 * ============================================================================
 * Modelo reactivo de controles para cada fila de apoderado dentro del FormArray.
 *
 * @remarks
 * Regla de Oro: 1 sola clase por archivo.
 * Extiende de {@link FormModel} para heredar `getErrorMessage(control, form)`.
 * ============================================================================
 */
export class GuardianFormModel extends FormModel {
  /** DNI civil del apoderado: 8 dígitos */
  dni = ['', [Validators.required, Validators.pattern(/^\d{8}$/)]];

  /** Nombres de pila */
  firstName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Apellidos */
  lastName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Parentesco o relación jurídica */
  relationship = ['PADRE', [Validators.required]];

  /** Contacto principal del alumno */
  isPrimary = [false];

  /** Celular de emergencia */
  phone = ['', [Validators.pattern(/^\d{9}$/)]];

  /** Correo de contacto del apoderado */
  email = ['', [Validators.email]];
}
