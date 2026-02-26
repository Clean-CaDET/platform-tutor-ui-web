import { Routes } from '@angular/router';

export const SUPERVISION_ROUTES: Routes = [
  {
    path: 'active',
    loadComponent: () =>
      import('./active-supervision.component').then(m => m.ActiveSupervisionComponent),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reporting.component').then(m => m.ReportingComponent),
  },
  { path: '', redirectTo: 'active', pathMatch: 'full' },
];
