import { FormHtml } from '../../../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT
 * ============================================================================
 * Constante inmutable de metadata visual para el formulario de trabajador.
 * ============================================================================
 */
export const WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
  dni: Object.freeze({
    formControlName: 'dni',
    label: 'DNI del Colaborador',
    placeHolder: '8 dígitos numéricos (ej: 60798890)',
    type: 'text',
    iconLeft: 'badge',
    validators: { minLength: 8, maxLength: 8 }
  }),
  firstName: Object.freeze({
    formControlName: 'firstName',
    label: 'Nombres',
    placeHolder: 'Ej: Manuel Alberto',
    type: 'text',
    iconLeft: 'person',
    validators: { minLength: 2, maxLength: 80 }
  }),
  lastName: Object.freeze({
    formControlName: 'lastName',
    label: 'Apellidos',
    placeHolder: 'Ej: Quispe Soto',
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
    placeHolder: 'colaborador@eduportal.pe',
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
  position: Object.freeze({
    formControlName: 'position',
    label: 'Cargo Institucional',
    iconLeft: 'work'
  }),
  shift: Object.freeze({
    formControlName: 'shift',
    label: 'Turno Laboral',
    iconLeft: 'schedule'
  }),
  hireDate: Object.freeze({
    formControlName: 'hireDate',
    label: 'Fecha de Ingreso',
    type: 'date',
    iconLeft: 'calendar_today'
  })
});
