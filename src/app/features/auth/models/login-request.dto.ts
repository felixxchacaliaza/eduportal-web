/**
 * ============================================================================
 * LoginRequestDto Interface
 * ============================================================================
 * Contrato de transferencia de datos enviado en POST /api/auth/login.
 * ============================================================================
 */
export interface LoginRequestDto {
  readonly email: string;
  readonly password: string;
}
