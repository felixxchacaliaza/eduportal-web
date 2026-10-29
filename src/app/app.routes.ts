import { Routes } from '@angular/router';
import { menuResolver } from './core/resolvers/menu.resolver';
import { authGuard, publicGuard } from './core/auth/guards';

/**
 * ============================================================================
 * App Root Routes (Enrutamiento Principal Multi-Layout de EduPortal)
 * ============================================================================
 * Estructura Multi-Layout desacoplada:
 * 1. `/login`: Shell AuthLayout público protegido por `publicGuard`.
 * 2. `''`: Shell MainLayout corporativo protegido por `authGuard`.
 * ============================================================================
 */
export const routes: Routes = [
  // Layout Público de Autenticación
  {
    path: 'login',
    loadComponent: () =>
      import('./core/layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    canActivate: [publicGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
      }
    ]
  },

  // Layout Privado de la Aplicación (App Shell)
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    resolve: {
      menuTree: menuResolver
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(
            m => m.DashboardPageComponent
          )
      },
      {
        path: 'alumnos',
        loadChildren: () =>
          import('./features/students/students.routes').then(m => m.STUDENTS_ROUTES)
      },
      {
        path: 'personal',
        loadChildren: () =>
          import('./features/staff/staff.routes').then(m => m.STAFF_ROUTES)
      },
      {
        path: 'calificaciones',
        loadChildren: () =>
          import('./features/evaluations/evaluations.routes').then(m => m.EVALUATIONS_ROUTES)
      },
      {
        path: 'notas',
        redirectTo: 'calificaciones',
        pathMatch: 'full'
      },
      {
        path: 'asistencia',
        loadChildren: () =>
          import('./features/attendances/attendance.routes').then(m => m.ATTENDANCE_ROUTES)
      },
      {
        path: 'incidencias',
        loadChildren: () =>
          import('./features/incidents/incidents.routes').then(m => m.INCIDENTS_ROUTES)
      },
      {
        path: 'pensiones',
        loadChildren: () =>
          import('./features/tuition-payments/tuition-payments.routes').then(m => m.TUITION_PAYMENTS_ROUTES)
      },
      {
        path: 'seguridad',
        loadChildren: () =>
          import('./features/security/security.routes').then(m => m.SECURITY_ROUTES)
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./features/security/security.routes').then(m => m.SECURITY_ROUTES)
      },
      {
        path: 'perfiles',
        loadChildren: () =>
          import('./features/security/security.routes').then(m => m.SECURITY_ROUTES)
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/academic').then(m => m.ACADEMIC_ROUTES)
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/maintenance').then(m => m.MAINTENANCE_ROUTES)
      }
    ]
  },

  // Redirección por defecto
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
