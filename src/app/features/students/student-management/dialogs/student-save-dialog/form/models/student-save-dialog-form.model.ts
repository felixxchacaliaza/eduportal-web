import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * StudentSaveDialogFormModel
 * ============================================================================
 * Modelo reactivo de controles para los datos personales del estudiante.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
export class StudentSaveDialogFormModel extends FormModel {
  /** DNI único de 8 dígitos numéricos */
  dni = ['', [Validators.required, Validators.pattern(/^\d{8}$/)]];

  /** Nombres de pila del estudiante */
  firstName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Apellidos legales del estudiante */
  lastName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Género biológico o de registro */
  gender = ['M', [Validators.required]];

  /** Correo electrónico institucional o personal */
  personalEmail = ['', [Validators.required, Validators.email]];

  /** Teléfono celular de 9 dígitos */
  phone = ['', [Validators.pattern(/^\d{9}$/)]];

  /** Dirección de residencia */
  address = [''];

  /** Año de ingreso formal a la institución */
  entryYear = ['2026', [Validators.required, Validators.pattern(/^\d{4}$/)]];
}
