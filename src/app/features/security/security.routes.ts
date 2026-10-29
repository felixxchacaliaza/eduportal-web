import { Routes } from '@angular/router';

/**
 * ============================================================================
 * SECURITY_ROUTES
 * ============================================================================
 * Enrutamiento perezoso para el subsistema de Seguridad y Control de Acceso.
 * ============================================================================
 */
export const SECURITY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/security-management/security-management.component').then(
        m => m.SecurityManagementComponent
      )
  }
];
