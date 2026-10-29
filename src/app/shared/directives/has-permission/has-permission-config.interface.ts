/**
 * ============================================================================
 * HasPermissionConfig Interface
 * ============================================================================
 * Configuración polimórfica para la directiva estructural *appHasPermission.
 * Permite especificar el módulo y opcionalmente el nivel de privilegio requerido.
 * ============================================================================
 */
export interface HasPermissionConfig {
  readonly module: string;
  readonly level?: 'FULL' | 'READ_ONLY';
}
