import { ProfilePermission } from './profile-permission.interface';

/**
 * ============================================================================
 * Profile Interface
 * ============================================================================
 * Representa un rol institucional con matriz de permisos asignada.
 * ============================================================================
 */
export interface Profile {
  readonly id: string;
  readonly _id?: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly isSuperAdmin: boolean;
  readonly isSystem?: boolean;
  readonly enabled: boolean;
  readonly permissions: readonly ProfilePermission[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
}
