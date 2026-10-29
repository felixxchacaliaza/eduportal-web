import { Routes } from '@angular/router';

export const TUITION_PAYMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/tuition-payments-list/tuition-payments-list.component'
      ).then((m) => m.TuitionPaymentsListComponent),
  },
];
