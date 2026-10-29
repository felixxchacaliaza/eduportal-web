import { FormControl } from '@angular/forms';

/**
 * ============================================================================
 * ProfileFormControls Interface
 * ============================================================================
 * Contrato estrictamente tipado para los controles del formulario de Perfil.
 * ============================================================================
 */
export interface ProfileFormControls {
  readonly name: FormControl<string>;
  readonly description: FormControl<string>;
  readonly isSuperAdmin: FormControl<boolean>;
  readonly enabled: FormControl<boolean>;
}

/**
 * ============================================================================
 * ProfileFormValue Interface
 * ============================================================================
 * Estructura de datos inmutable extraída del formulario de perfil.
 * ============================================================================
 */
export interface ProfileFormValue {
  readonly name: string;
  readonly description: string;
  readonly isSuperAdmin: boolean;
  readonly enabled: boolean;
}
