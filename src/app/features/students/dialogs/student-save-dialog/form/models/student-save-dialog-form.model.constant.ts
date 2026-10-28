import { FormHtml } from '../../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT
 * ============================================================================
 * Constante inmutable que encapsula la metadata visual de los campos del alumno.
 * Desacopla completamente etiquetas, placeholders e iconos del HTML.
 * ============================================================================
 */
export const STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
  dni: Object.freeze({
    formControlName: 'dni',
    label: 'DNI del Estudiante',
    placeHolder: '8 dígitos numéricos (ej: 72819203)',
    type: 'text',
    iconLeft: 'badge',
    validators: { minLength: 8, maxLength: 8 }
  }),
  firstName: Object.freeze({
    formControlName: 'firstName',
    label: 'Nombres',
    placeHolder: 'Ej: Mateo Alexander',
    type: 'text',
    iconLeft: 'person',
    validators: { minLength: 2, maxLength: 80 }
  }),
  lastName: Object.freeze({
    formControlName: 'lastName',
    label: 'Apellidos',
    placeHolder: 'Ej: Mendoza Quispe',
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
    placeHolder: 'alumno@ejemplo.com',
    type: 'email',
    iconLeft: 'mail'
  }),
  phone: Object.freeze({
    formControlName: 'phone',
    label: 'Teléfono / Celular (Opcional)',
    placeHolder: 'Ej: 987654321',
    type: 'tel',
    iconLeft: 'phone'
  }),
  address: Object.freeze({
    formControlName: 'address',
    label: 'Dirección Domiciliaria',
    placeHolder: 'Av. Las Palmeras 123, Lima',
    type: 'text',
    iconLeft: 'home'
  }),
  entryYear: Object.freeze({
    formControlName: 'entryYear',
    label: 'Año de Ingreso Escolar',
    placeHolder: '2026',
    type: 'text',
    iconLeft: 'calendar_today',
    validators: { minLength: 4, maxLength: 4 }
  })
});
