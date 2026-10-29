/**
 * ============================================================================
 * User Interface
 * ============================================================================
 * Representa una cuenta de acceso web en EduPortal vinculada a persona y perfil.
 * ============================================================================
 */
export interface User {
  readonly id: string;
  readonly _id?: string;
  readonly code: string;
  readonly email: string;
  readonly person: {
    readonly id?: string;
    readonly _id?: string;
    readonly dni?: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly fullName?: string;
    readonly personalEmail?: string;
    readonly phone?: string;
  };
  readonly profile: {
    readonly id?: string;
    readonly _id?: string;
    readonly code?: string;
    readonly name?: string;
    readonly isSuperAdmin?: boolean;
  };
  readonly enabled: boolean;
  readonly isProtected?: boolean;
  readonly lastLogin?: string;
  readonly createdAt?: string;
}
