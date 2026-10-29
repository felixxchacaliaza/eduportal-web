import { Routes } from '@angular/router';

export const INCIDENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/incidents-list/incidents-list.component').then(
        (m) => m.IncidentsListComponent
      ),
  },
];
