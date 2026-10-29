import { FormControl } from '@angular/forms';

/**
 * ============================================================================
 * LoginFormControls Interface
 * ============================================================================
 * Contrato estrictamente tipado para los controles del formulario de Login.
 * ============================================================================
 */
export interface LoginFormControls {
  readonly email: FormControl<string>;
  readonly password: FormControl<string>;
  readonly rememberMe: FormControl<boolean>;
}

/**
 * ============================================================================
 * LoginFormValue Interface
 * ============================================================================
 * Estructura de datos inmutable extraída del formulario al enviar credenciales.
 * ============================================================================
 */
export interface LoginFormValue {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;
}
