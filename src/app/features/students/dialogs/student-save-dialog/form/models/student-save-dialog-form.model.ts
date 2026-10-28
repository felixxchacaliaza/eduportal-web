import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * StudentSaveDialogFormModel
 * ============================================================================
 * Modelo reactivo de controles para los datos civiles y académicos del alumno.
 *
 * @remarks
 * Regla de Oro: 1 sola clase por archivo.
 * Extiende de {@link FormModel} para heredar la resolución automática de errores
 * mediante `getErrorMessage(control, form)`.
 * ============================================================================
 */
export class StudentSaveDialogFormModel extends FormModel {
  /** DNI civil: exactamente 8 dígitos numéricos */
  dni = ['', [Validators.required, Validators.pattern(/^\d{8}$/)]];

  /** Nombres de pila: mínimo 2 caracteres */
  firstName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Apellidos paterno/materno: mínimo 2 caracteres */
  lastName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Género civil: M o F */
  gender = ['M', [Validators.required]];

  /** Correo electrónico personal */
  personalEmail = ['', [Validators.required, Validators.email]];

  /** Teléfono de contacto opcional */
  phone = ['', [Validators.pattern(/^\d{9}$/)]];

  /** Dirección de residencia */
  address = [''];

  /** Año de ingreso al colegio */
  entryYear = ['2026', [Validators.required, Validators.pattern(/^\d{4}$/)]];
}
