import { Routes } from '@angular/router';

/**
 * ============================================================================
 * MAINTENANCE_ROUTES (Enrutamiento del Módulo de Mantenimiento)
 * ============================================================================
 * Define las rutas secundarias del módulo de tablas maestras y mantenimiento:
 * - Niveles Educativos (`/niveles`)
 * - Áreas Curriculares (`/areas`)
 * ============================================================================
 */
export const MAINTENANCE_ROUTES: Routes = [
  {
    path: 'niveles',
    loadComponent: () =>
      import('./levels/levels.component').then(m => m.LevelsComponent),
  },
  {
    path: 'areas',
    loadComponent: () =>
      import('./areas/areas.component').then(m => m.AreasComponent),
  },
  {
    path: 'cargos',
    loadComponent: () =>
      import('./pages/positions/positions.component').then(m => m.PositionsComponent),
  },
];
