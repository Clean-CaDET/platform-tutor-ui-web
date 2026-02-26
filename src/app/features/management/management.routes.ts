import { Routes } from '@angular/router';

export const MANAGEMENT_ROUTES: Routes = [
  {
    path: 'courses',
    loadComponent: () => import('./courses/courses.component').then(m => m.CoursesComponent),
  },
  {
    path: 'stakeholders/learners',
    loadComponent: () => import('./learners/learners.component').then(m => m.LearnersComponent),
  },
  {
    path: 'stakeholders/instructors',
    loadComponent: () => import('./instructors/instructors.component').then(m => m.InstructorsComponent),
  },
];
