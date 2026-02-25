import { Routes } from '@angular/router';

export const AUTHORING_ROUTES: Routes = [
  {
    path: ':courseId/units',
    loadComponent: () =>
      import('./course-structure/course-structure.component').then(m => m.CourseStructureComponent),
  },
];
