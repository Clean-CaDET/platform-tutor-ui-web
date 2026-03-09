import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.user();

  if (user === null) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['role'] as string[] | undefined;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
