import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * ============================================================================
 * publicGuard
 * ============================================================================
 * Guard funcional para rutas públicas (ej. /login).
 * Si el usuario ya cuenta con una sesión activa, lo redirige al dashboard.
 * ============================================================================
 */
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
