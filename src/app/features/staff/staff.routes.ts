import { Routes } from '@angular/router';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./staff-management/staff-management.component').then(
        m => m.StaffManagementComponent
      )
  }
];
