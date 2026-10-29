import { Routes } from '@angular/router';

/**
 * ============================================================================
 * EVALUATIONS_ROUTES
 * ============================================================================
 * Enrutador con carga perezosa para el subsistema de calificaciones escolares.
 * ============================================================================
 */
export const EVALUATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./grade-book/grade-book.component').then(m => m.GradeBookComponent),
  },
];
