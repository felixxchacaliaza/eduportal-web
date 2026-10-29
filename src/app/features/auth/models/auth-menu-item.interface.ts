/**
 * ============================================================================
 * AuthMenuItem Interface
 * ============================================================================
 * Representa un nodo del árbol de navegación retornado por el backend con
 * nivel de acceso RBAC asignado al perfil del usuario autenticado.
 * ============================================================================
 */
export interface AuthMenuItem {
  readonly id: string;
  readonly key: string;
  readonly label: string;
  readonly icon: string;
  readonly path: string | null;
  readonly accessLevel: 'FULL' | 'READ_ONLY';
  readonly children?: readonly AuthMenuItem[];
}
