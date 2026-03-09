import { Routes } from '@angular/router';

export const MONITORING_ROUTES: Routes = [
  {
    path: ':courseId/:mode',
    loadComponent: () =>
      import('./group-monitoring/group-monitoring.component').then(m => m.GroupMonitoringComponent),
  },
];
