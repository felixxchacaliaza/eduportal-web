import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * TeacherSaveDialogFormModel
 * ============================================================================
 * Modelo reactivo de controles para los datos de profesor y horas de cátedra.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
export class TeacherSaveDialogFormModel extends FormModel {
  /** DNI único de 8 dígitos numéricos */
  dni = ['', [Validators.required, Validators.pattern(/^\d{8}$/)]];

  /** Nombres de pila del profesor */
  firstName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Apellidos legales del profesor */
  lastName = ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]];

  /** Género biológico o de registro */
  gender = ['M', [Validators.required]];

  /** Correo electrónico de contacto */
  personalEmail = ['', [Validators.required, Validators.email]];

  /** Teléfono celular de 9 dígitos */
  phone = ['', [Validators.pattern(/^\d{9}$/)]];

  /** Dirección de residencia */
  address = [''];

  /** Especialidad pedagógica o área principal */
  specialty = ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]];

  /** Grado académico alcanzado */
  academicDegree = ['LICENCIADO', [Validators.required]];

  /** Horas lectivas contratadas semanalmente (Regla RN-DOC-02: 1 a 48) */
  contractedHours = [30, [Validators.required, Validators.min(1), Validators.max(48)]];
}
