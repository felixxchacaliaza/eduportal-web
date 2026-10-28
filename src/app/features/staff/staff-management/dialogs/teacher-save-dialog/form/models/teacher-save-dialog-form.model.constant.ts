import { FormHtml } from '../../../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT
 * ============================================================================
 * Constante inmutable de metadata visual para el formulario de profesor.
 * ============================================================================
 */
export const TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
  dni: Object.freeze({
    formControlName: 'dni',
    label: 'DNI del Profesor',
    placeHolder: '8 dígitos numéricos (ej: 70899901)',
    type: 'text',
    iconLeft: 'badge',
    validators: { minLength: 8, maxLength: 8 }
  }),
  firstName: Object.freeze({
    formControlName: 'firstName',
    label: 'Nombres',
    placeHolder: 'Ej: Carlos Alberto',
    type: 'text',
    iconLeft: 'person',
    validators: { minLength: 2, maxLength: 80 }
  }),
  lastName: Object.freeze({
    formControlName: 'lastName',
    label: 'Apellidos',
    placeHolder: 'Ej: Valdivia Herrera',
    type: 'text',
    iconLeft: 'badge',
    validators: { minLength: 2, maxLength: 80 }
  }),
  gender: Object.freeze({
    formControlName: 'gender',
    label: 'Género',
    iconLeft: 'wc'
  }),
  personalEmail: Object.freeze({
    formControlName: 'personalEmail',
    label: 'Correo Electrónico',
    placeHolder: 'docente@eduportal.pe',
    type: 'email',
    iconLeft: 'mail'
  }),
  phone: Object.freeze({
    formControlName: 'phone',
    label: 'Teléfono Móvil',
    placeHolder: '9 dígitos (opcional)',
    type: 'text',
    iconLeft: 'phone',
    validators: { minLength: 9, maxLength: 9 }
  }),
  address: Object.freeze({
    formControlName: 'address',
    label: 'Dirección de Domicilio',
    placeHolder: 'Av. / Jr. / Calle...',
    type: 'text',
    iconLeft: 'home'
  }),
  specialty: Object.freeze({
    formControlName: 'specialty',
    label: 'Especialidad Curricular',
    placeHolder: 'Ej: Matemática, Ciencias Sociales, Inglés...',
    type: 'text',
    iconLeft: 'school',
    validators: { minLength: 3, maxLength: 80 }
  }),
  academicDegree: Object.freeze({
    formControlName: 'academicDegree',
    label: 'Grado Académico',
    iconLeft: 'workspace_premium'
  }),
  contractedHours: Object.freeze({
    formControlName: 'contractedHours',
    label: 'Horas Semanales Contratadas',
    placeHolder: 'Ej: 30',
    type: 'number',
    iconLeft: 'schedule',
    validators: { minLength: 1, maxLength: 48 }
  })
});
