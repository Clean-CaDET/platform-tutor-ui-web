import { Routes } from '@angular/router';

export const LEARNING_ROUTES: Routes = [
  {
    path: ':courseId',
    loadComponent: () =>
      import('./course/course.component').then(m => m.CourseComponent),
  },
  {
    path: ':courseId/units/:unitId',
    loadComponent: () =>
      import('./unit/unit.component').then(m => m.UnitComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./unit/unit-details/unit-details.component').then(m => m.UnitDetailsComponent),
      },
    ],
  },
];
