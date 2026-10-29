import { AuthUser } from './auth-user.interface';

/**
 * ============================================================================
 * LoginResponseData Interface
 * ============================================================================
 * Estructura del cuerpo de datos retornado en autenticación exitosa.
 * ============================================================================
 */
export interface LoginResponseData {
  readonly token: string;
  readonly expiresIn: string;
  readonly user: AuthUser;
}

/**
 * ============================================================================
 * LoginResponse Interface
 * ============================================================================
 * Respuesta estandarizada del endpoint de autenticación.
 * ============================================================================
 */
export interface LoginResponse {
  readonly success: boolean;
  readonly data: LoginResponseData;
  readonly message?: string;
}
