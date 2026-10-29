import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { menuResolver } from './core/resolvers/menu.resolver';
import { authGuard, publicGuard } from './core/auth/guards';

/**
 * ============================================================================
 * App Root Routes (Shell Host de Microfrontends EduPortal)
 * ============================================================================
 * Orquestación dinámica de 8 Microfrontends remotos con Native Federation:
 * - `mfeStudents` (Puerto 4201): `/alumnos`
 * - `mfeStaff` (Puerto 4202): `/personal`
 * - `mfeAcademic` (Puerto 4203): `/grados-secciones`, `/grados-asignaturas`, `/asignaturas`
 * - `mfeEvaluations` (Puerto 4204): `/calificaciones`, `/notas`
 * - `mfeAttendances` (Puerto 4205): `/asistencia`
 * - `mfeIncidents` (Puerto 4206): `/incidencias`
 * - `mfeFinance` (Puerto 4207): `/pensiones`
 * - `mfeMaintenance` (Puerto 4208): `/niveles`, `/areas`, `/cargos`
 *
 * Cada ruta remota implementa un fallback resiliente para garantizar
 * alta disponibilidad y excelente experiencia de desarrollo (DX).
 * ============================================================================
 */
export const routes: Routes = [
  // Layout Público de Autenticación (Alojado en Shell Host)
  {
    path: 'login',
    loadComponent: () =>
      import('./core/layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    canActivate: [publicGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },

  // Layout Privado de la Aplicación (Shell Host Orquestador)
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [authGuard],
    resolve: {
      menuTree: menuResolver,
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/dashboard/pages/dashboard-page/dashboard-page.component'
          ).then((m) => m.DashboardPageComponent),
      },

      // 1. Remote MFE: Estudiantes y Matrícula (Puerto 4201)
      {
        path: 'alumnos',
        loadChildren: () =>
          loadRemoteModule('mfeStudents', './routes')
            .then((m) => m.routes || m.default || m.STUDENTS_ROUTES)
            .catch((err) => {
              console.warn('[Host Shell] mfeStudents remote offline, cargando fallback local:', err);
              return import('./features/students/students.routes').then(
                (m) => m.STUDENTS_ROUTES
              );
            }),
      },

      // 2. Remote MFE: Personal Escolar (Puerto 4202)
      {
        path: 'personal',
        loadChildren: () =>
          loadRemoteModule('mfeStaff', './routes')
            .then((m) => m.routes || m.default || m.STAFF_ROUTES)
            .catch((err) => {
              console.warn('[Host Shell] mfeStaff remote offline, cargando fallback local:', err);
              return import('./features/staff/staff.routes').then(
                (m) => m.STAFF_ROUTES
              );
            }),
      },

      // 3. Remote MFE: Calificaciones MINEDU (Puerto 4204)
      {
        path: 'calificaciones',
        loadChildren: () =>
          loadRemoteModule('mfeEvaluations', './routes')
            .then((m) => m.routes || m.default || m.EVALUATIONS_ROUTES)
            .catch((err) => {
              console.warn('[Host Shell] mfeEvaluations remote offline, cargando fallback local:', err);
              return import('./features/evaluations/evaluations.routes').then(
                (m) => m.EVALUATIONS_ROUTES
              );
            }),
      },
      {
        path: 'notas',
        redirectTo: 'calificaciones',
        pathMatch: 'full',
      },

      // 4. Remote MFE: Asistencia Diaria (Puerto 4205)
      {
        path: 'asistencia',
        loadChildren: () =>
          loadRemoteModule('mfeAttendances', './routes')
            .then((m) => m.routes || m.default || m.ATTENDANCE_ROUTES)
            .catch((err) => {
              console.warn('[Host Shell] mfeAttendances remote offline, cargando fallback local:', err);
              return import('./features/attendances/attendance.routes').then(
                (m) => m.ATTENDANCE_ROUTES
              );
            }),
      },

      // 5. Remote MFE: Convivencia y Psicología (Puerto 4206)
      {
        path: 'incidencias',
        loadChildren: () =>
          loadRemoteModule('mfeIncidents', './routes')
            .then((m) => m.routes || m.default || m.INCIDENTS_ROUTES)
            .catch((err) => {
              console.warn('[Host Shell] mfeIncidents remote offline, cargando fallback local:', err);
              return import('./features/incidents/incidents.routes').then(
                (m) => m.INCIDENTS_ROUTES
              );
            }),
      },

      // 6. Remote MFE: Pensiones y Cobranzas (Puerto 4207)
      {
        path: 'pensiones',
        loadChildren: () =>
          loadRemoteModule('mfeFinance', './routes')
            .then((m) => m.routes || m.default || m.TUITION_PAYMENTS_ROUTES)
            .catch((err) => {
              console.warn('[Host Shell] mfeFinance remote offline, cargando fallback local:', err);
              return import(
                './features/tuition-payments/tuition-payments.routes'
              ).then((m) => m.TUITION_PAYMENTS_ROUTES);
            }),
      },

      // Seguridad y Accesos (Alojado en Shell Host)
      {
        path: 'seguridad',
        loadChildren: () =>
          import('./features/security/security.routes').then(
            (m) => m.SECURITY_ROUTES
          ),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./features/security/security.routes').then(
            (m) => m.SECURITY_ROUTES
          ),
      },
      {
        path: 'perfiles',
        loadChildren: () =>
          import('./features/security/security.routes').then(
            (m) => m.SECURITY_ROUTES
          ),
      },

      // 7. Remote MFE: Gestión Académica (Puerto 4203)
      {
        path: '',
        loadChildren: () =>
          loadRemoteModule('mfeAcademic', './routes')
            .then((m) => m.routes || m.default || m.ACADEMIC_ROUTES)
            .catch((err) => {
              console.warn('[Host Shell] mfeAcademic remote offline, cargando fallback local:', err);
              return import('./features/academic').then((m) => m.ACADEMIC_ROUTES);
            }),
      },

      // 8. Remote MFE: Mantenimiento y Tablas Maestras (Puerto 4208)
      {
        path: '',
        loadChildren: () =>
          loadRemoteModule('mfeMaintenance', './routes')
            .then((m) => m.routes || m.default || m.MAINTENANCE_ROUTES)
            .catch((err) => {
              console.warn('[Host Shell] mfeMaintenance remote offline, cargando fallback local:', err);
              return import('./features/maintenance').then(
                (m) => m.MAINTENANCE_ROUTES
              );
            }),
      },
    ],
  },

  // Redirección por defecto
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
