import { AuthMenuItem } from './auth-menu-item.interface';

/**
 * ============================================================================
 * AuthUser Interface
 * ============================================================================
 * Representa la entidad del usuario autenticado en la sesión activa.
 * ============================================================================
 */
export interface AuthUser {
  readonly id: string;
  readonly code: string;
  readonly email: string;
  readonly person: {
    readonly id: string;
    readonly dni: string;
    readonly fullName: string;
  };
  readonly profile: {
    readonly id: string;
    readonly name: string;
    readonly isSuperAdmin: boolean;
  };
  readonly menuTree: readonly AuthMenuItem[];
}
