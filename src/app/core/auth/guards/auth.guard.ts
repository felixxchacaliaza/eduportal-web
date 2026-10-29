import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * ============================================================================
 * authGuard
 * ============================================================================
 * Guard funcional que protege rutas privadas. Requiere que el usuario
 * posea un token y perfil autenticado en sesión activa.
 * Redirige a /login con returnUrl si la sesión no es válida.
 * ============================================================================
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
