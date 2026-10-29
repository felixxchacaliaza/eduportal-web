/**
 * ============================================================================
 * SaveUserDto Interface
 * ============================================================================
 * Carga útil para la creación y actualización de una cuenta de usuario.
 * ============================================================================
 */
export interface SaveUserDto {
  readonly person: string;
  readonly profile: string;
  readonly email: string;
  readonly password?: string;
  readonly enabled?: boolean;
}
