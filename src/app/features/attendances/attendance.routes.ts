import { Routes } from '@angular/router';

/**
 * ============================================================================
 * ATTENDANCE_ROUTES
 * ============================================================================
 * Definición de rutas hijas para el módulo de control de asistencias e incidencias.
 * ============================================================================
 */
export const ATTENDANCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./attendance-management/attendance-management.component').then(
        m => m.AttendanceManagementComponent
      )
  }
];
