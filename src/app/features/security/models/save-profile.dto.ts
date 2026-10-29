/**
 * ============================================================================
 * SaveProfileDto Interface
 * ============================================================================
 * Carga útil para la creación y actualización de un perfil con permisos RBAC.
 * ============================================================================
 */
export interface SaveProfileDto {
  readonly code?: string;
  readonly name: string;
  readonly description?: string;
  readonly isSuperAdmin?: boolean;
  readonly enabled?: boolean;
  readonly permissions: readonly {
    readonly menu: string;
    readonly accessLevel: 'FULL' | 'READ_ONLY';
  }[];
}
