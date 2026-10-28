import { FormHtml } from '../../../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * GUARDIAN_FORM_MODEL_CONSTANT
 * ============================================================================
 * Constante inmutable de metadata visual para cada fila de apoderado.
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
    label: 'Nombres del Apoderado',
    placeHolder: 'Nombres completos',
    type: 'text',
    iconLeft: 'person',
    validators: { minLength: 2, maxLength: 80 }
  }),
  lastName: Object.freeze({
    formControlName: 'lastName',
    label: 'Apellidos del Apoderado',
    placeHolder: 'Apellidos completos',
    type: 'text',
    iconLeft: 'badge',
    validators: { minLength: 2, maxLength: 80 }
  }),
  relationship: Object.freeze({
    formControlName: 'relationship',
    label: 'Parentesco',
    iconLeft: 'family_restroom'
  }),
  isPrimary: Object.freeze({
    formControlName: 'isPrimary',
    label: 'Contacto Principal'
  }),
  phone: Object.freeze({
    formControlName: 'phone',
    label: 'Celular del Apoderado',
    placeHolder: '9 dígitos (opcional)',
    type: 'text',
    iconLeft: 'phone',
    validators: { minLength: 9, maxLength: 9 }
  }),
  email: Object.freeze({
    formControlName: 'email',
    label: 'Correo de Contacto',
    placeHolder: 'apoderado@ejemplo.com',
    type: 'email',
    iconLeft: 'mail'
  })
});
