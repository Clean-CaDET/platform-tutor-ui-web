import { Routes } from '@angular/router';
import { confirmExitGuard } from '../../core/confirm-exit.guard';

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
      {
        path: 'kcs/:kcId',
        loadComponent: () =>
          import('./knowledge-component/knowledge-component.component').then(m => m.KnowledgeComponentComponent),
      },
      {
        path: 'tasks/:taskId',
        loadComponent: () =>
          import('./task/task.component').then(m => m.TaskComponent),
        canDeactivate: [confirmExitGuard],
      },
      {
        path: 'reflections/:reflectionId',
        loadComponent: () =>
          import('./reflection/reflection.component').then(m => m.ReflectionComponent),
      },
      {
        path: 'concept-elaborations/:taskId',
        loadComponent: () =>
          import('./concept-elaboration/concept-elaboration.component').then(m => m.ConceptElaborationComponent),
        canDeactivate: [confirmExitGuard],
      },
    ],
  },
];
