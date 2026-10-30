import { Routes } from '@angular/router';

/**
 * ============================================================================
 * ACADEMIC_ROUTES (Enrutamiento del Módulo Académico)
 * ============================================================================
 * Define las rutas secundarias del sub-módulo académico cargadas mediante
 * Lazy Loading (`loadComponent`) con componentes Standalone.
 * ============================================================================
 */
export const ACADEMIC_ROUTES: Routes = [
  {
    path: 'asignaturas',
    loadComponent: () =>
      import('./subjects/subjects.component').then(m => m.SubjectsComponent),
  },
  {
    path: 'grados-asignaturas',
    loadComponent: () =>
      import('./grade-subjects/grade-subjects.component').then(m => m.GradeSubjectsComponent),
  },
  {
    path: 'grados-secciones',
    loadComponent: () =>
      import('./grades-sections/grades-sections.component').then(m => m.GradesSectionsComponent),
  },
  //poner uno mas
];