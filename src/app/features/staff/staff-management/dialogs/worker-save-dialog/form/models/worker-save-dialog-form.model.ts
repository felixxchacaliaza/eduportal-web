import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * WorkerSaveDialogFormModel
 * ============================================================================
 * Modelo reactivo de controles para los datos de trabajador administrativo.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
export class WorkerSaveDialogFormModel extends FormModel {
  /** DNI único de 8 dígitos numéricos */
  dni = ['', [Validators.required, Validators.pattern(/^\d{8}$/)]];

  /** Nombres de pila del trabajador */
  firstName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Apellidos legales del trabajador */
  lastName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Género biológico o de registro */
  gender = ['M', [Validators.required]];

  /** Correo electrónico de contacto */
  personalEmail = ['', [Validators.required, Validators.email]];

  /** Teléfono celular de 9 dígitos */
  phone = ['', [Validators.pattern(/^\d{9}$/)]];

  /** Dirección de residencia */
  address = [''];

  /** Identificador del cargo institucional asignado */
  position = ['', [Validators.required]];

  /** Turno de trabajo asignado */
  shift = ['COMPLETO', [Validators.required]];

  /** Fecha de ingreso formal a la institución */
  hireDate = [new Date().toISOString().substring(0, 10), [Validators.required]];
}
