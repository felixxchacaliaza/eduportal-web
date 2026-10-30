import { Routes } from '@angular/router';

export const MAINTENANCE_ROUTES: Routes = [
  {
    path: 'niveles',
    loadComponent: () =>
      import('./levels/levels.component').then(m => m.LevelsComponent),
  },
  /*{
    path: 'areas',
    loadComponent: () =>
      import('./areas/areas.component').then(m => m.AreasComponent),
  },*/
];