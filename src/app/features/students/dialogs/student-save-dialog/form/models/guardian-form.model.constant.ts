import { FormHtml } from '../../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * GUARDIAN_FORM_MODEL_CONSTANT
 * ============================================================================
 * Constante inmutable que encapsula la metadata visual para los campos de apoderados.
 * ============================================================================
 */
export const GUARDIAN_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
  dni: Object.freeze({
    formControlName: 'dni',
    label: 'DNI del Apoderado',
    placeHolder: '8 dígitos',
    type: 'text',
    iconLeft: 'badge',
    validators: { minLength: 8, maxLength: 8 }
  }),
  firstName: Object.freeze({
    formControlName: 'firstName',
    label: 'Nombres',
    placeHolder: 'Nombres del apoderado',
    type: 'text',
    iconLeft: 'person',
    validators: { minLength: 2, maxLength: 80 }
  }),
  lastName: Object.freeze({
    formControlName: 'lastName',
    label: 'Apellidos',
    placeHolder: 'Apellidos del apoderado',
    type: 'text',
    iconLeft: 'badge',
    validators: { minLength: 2, maxLength: 80 }
  }),
  relationship: Object.freeze({
    formControlName: 'relationship',
    label: 'Parentesco Legal',
    iconLeft: 'family_restroom'
  }),
  isPrimary: Object.freeze({
    formControlName: 'isPrimary',
    label: 'Contacto Principal (Prioridad de Notificación)'
  }),
  phone: Object.freeze({
    formControlName: 'phone',
    label: 'Celular de Contacto',
    placeHolder: '9 dígitos (ej: 998877665)',
    type: 'tel',
    iconLeft: 'call'
  }),
  email: Object.freeze({
    formControlName: 'email',
    label: 'Correo Electrónico',
    placeHolder: 'apoderado@ejemplo.com',
    type: 'email',
    iconLeft: 'alternate_email'
  })
});
