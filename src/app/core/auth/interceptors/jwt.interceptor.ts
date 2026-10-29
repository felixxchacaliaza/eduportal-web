import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * ============================================================================
 * jwtInterceptor
 * ============================================================================
 * Interceptor funcional que inyecta automáticamente la cabecera `Authorization`
 * con el token Bearer en todas las solicitudes HTTP dirigidas a la API.
 * ============================================================================
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
