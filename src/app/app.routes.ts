import { Routes } from '@angular/router';
import { MAINTENANCE_ROUTES } from './features/maintenance/maintenance.routes';
import { ACADEMIC_ROUTES } from './features/academic/academic.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
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
        loadComponent: () =>
          import('./features/students/pages/students-page/students-page.component').then(
            m => m.StudentsPageComponent
          )
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
  }
];
