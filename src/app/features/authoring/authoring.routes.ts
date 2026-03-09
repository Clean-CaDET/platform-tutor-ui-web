import { Routes } from '@angular/router';
import { confirmExitGuard } from '../../core/confirm-exit.guard';

export const AUTHORING_ROUTES: Routes = [
  {
    path: ':courseId/units',
    loadComponent: () =>
      import('./course-structure/course-structure.component').then(m => m.CourseStructureComponent),
  },
  {
    path: ':courseId/units/:unitId/learning-tasks/:ltId',
    loadComponent: () =>
      import('./learning-tasks/learning-task/learning-task.component').then(m => m.LearningTaskComponent),
  },
  {
    path: ':courseId/units/:unitId/knowledge-components/:kcId',
    loadComponent: () =>
      import('./knowledge-component/knowledge-component-authoring.component').then(m => m.KnowledgeComponentAuthoringComponent),
    children: [
      {
        path: 'instruction',
        loadComponent: () =>
          import('./knowledge-component/instructional-items/instructional-items.component').then(m => m.InstructionalItemsComponent),
        canDeactivate: [confirmExitGuard],
      },
      {
        path: 'assessments',
        loadComponent: () =>
          import('./assessment-items/assessment-items.component').then(m => m.AssessmentItemsComponent),
        canDeactivate: [confirmExitGuard],
      },
      { path: '', redirectTo: 'instruction', pathMatch: 'full' },
    ],
  },
];
