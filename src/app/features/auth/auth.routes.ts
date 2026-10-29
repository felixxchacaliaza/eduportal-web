import { Routes } from '@angular/router';

/**
 * ============================================================================
 * AUTH_ROUTES
 * ============================================================================
 * Enrutamiento perezoso para el subsistema de autenticación.
 * ============================================================================
 */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  }
];
