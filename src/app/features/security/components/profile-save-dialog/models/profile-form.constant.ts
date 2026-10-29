import { ProfileFormValue } from './profile-form.model';

/**
 * ============================================================================
 * PROFILE_FORM_DEFAULTS Constant
 * ============================================================================
 * Valores predeterminados inmutables para el formulario de perfil.
 * ============================================================================
 */
export const PROFILE_FORM_DEFAULTS: ProfileFormValue = {
  name: '',
  description: '',
  isSuperAdmin: false,
  enabled: true
};
