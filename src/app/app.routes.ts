import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'courses',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/learning/learning.routes').then((m) => m.LEARNING_ROUTES),
  },
  {
    path: 'authoring',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/authoring/authoring.routes').then((m) => m.AUTHORING_ROUTES),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
