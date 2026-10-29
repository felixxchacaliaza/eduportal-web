import { FormControl } from '@angular/forms';

/**
 * ============================================================================
 * UserFormControls Interface
 * ============================================================================
 * Contrato estrictamente tipado para los controles del formulario de Usuario.
 * ============================================================================
 */
export interface UserFormControls {
  readonly person: FormControl<string>;
  readonly profile: FormControl<string>;
  readonly email: FormControl<string>;
  readonly password: FormControl<string>;
  readonly enabled: FormControl<boolean>;
}

/**
 * ============================================================================
 * UserFormValue Interface
 * ============================================================================
 * Estructura extraída de los controles del formulario de usuario.
 * ============================================================================
 */
export interface UserFormValue {
  readonly person: string;
  readonly profile: string;
  readonly email: string;
  readonly password: string;
  readonly enabled: boolean;
}
