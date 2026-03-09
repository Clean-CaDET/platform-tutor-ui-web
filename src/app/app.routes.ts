import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { LoginComponent } from './core/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [authGuard],
    component: HomeComponent,
  },
  {
    path: 'courses',
    canActivate: [authGuard],
    data: { role: ['learner', 'learnercommercial'] },
    loadChildren: () =>
      import('./features/learning/learning.routes').then((m) => m.LEARNING_ROUTES),
  },
  {
    path: 'authoring',
    canActivate: [authGuard],
    data: { role: ['instructor'] },
    loadChildren: () =>
      import('./features/authoring/authoring.routes').then((m) => m.AUTHORING_ROUTES),
  },
  {
    path: 'monitoring',
    canActivate: [authGuard],
    data: { role: ['instructor'] },
    loadChildren: () =>
      import('./features/monitoring/monitoring.routes').then((m) => m.MONITORING_ROUTES),
  },
  {
    path: 'management',
    canActivate: [authGuard],
    data: { role: ['administrator'] },
    loadChildren: () =>
      import('./features/management/management.routes').then((m) => m.MANAGEMENT_ROUTES),
  },
  {
    path: 'supervision',
    canActivate: [authGuard],
    data: { role: ['administrator'] },
    loadChildren: () =>
      import('./features/supervision/supervision.routes').then((m) => m.SUPERVISION_ROUTES),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
