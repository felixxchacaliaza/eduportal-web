import { UserFormValue } from './user-form.model';

/**
 * ============================================================================
 * USER_FORM_DEFAULTS Constant
 * ============================================================================
 * Valores iniciales inmutables para el formulario de cuenta de usuario.
 * ============================================================================
 */
export const USER_FORM_DEFAULTS: UserFormValue = {
  person: '',
  profile: '',
  email: '',
  password: '',
  enabled: true
};
