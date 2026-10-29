import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * ============================================================================
 * httpErrorInterceptor
 * ============================================================================
 * Interceptor funcional que captura anomalías HTTP globales.
 * En caso de respuestas 401 o 403 en endpoints protegidos, invalida la sesión
 * local y redirige de forma controlada a la pantalla de /login.
 * ============================================================================
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        // No interceptar las respuestas 401/403 originadas del propio intento de login
        const isLoginRequest = req.url.includes('/api/auth/login');

        if ((error.status === 401 || error.status === 403) && !isLoginRequest) {
          authService.clearSession();
          const currentUrl = router.url;
          if (!currentUrl.includes('/login')) {
            router.navigate(['/login'], {
              queryParams: { returnUrl: currentUrl }
            });
          }
        }
      }

      return throwError(() => error);
    })
  );
};
