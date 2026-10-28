import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * GuardianFormModel
 * ============================================================================
 * Modelo reactivo de controles para cada apoderado dentro del FormArray.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
export class GuardianFormModel extends FormModel {
  /** DNI del apoderado o tutor legal */
  dni = ['', [Validators.required, Validators.pattern(/^\d{8}$/)]];

  /** Nombres de pila del apoderado */
  firstName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Apellidos del apoderado */
  lastName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Parentesco formal con el estudiante */
  relationship = ['PADRE', [Validators.required]];

  /** Bandera de contacto principal de emergencia y citaciones */
  isPrimary = [false];

  /** Celular de contacto directo */
  phone = ['', [Validators.pattern(/^\d{9}$/)]];

  /** Correo electrónico para notificaciones */
  email = ['', [Validators.email]];
}
