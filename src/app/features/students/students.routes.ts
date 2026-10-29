import { Routes } from '@angular/router';

/**
 * ============================================================================
 * STUDENTS_ROUTES (Enrutamiento del Módulo de Estudiantes)
 * ============================================================================
 * Define las rutas secundarias del módulo de estudiantes:
 * - Padrón de Estudiantes y Matrícula Anual (`/alumnos`)
 * ============================================================================
 */
export const STUDENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./student-management/student-management.component').then(
        m => m.StudentManagementComponent
      ),
  },
];
