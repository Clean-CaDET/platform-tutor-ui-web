import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

/**
 * Recursively collects route params from a route and all its children.
 * Useful for reading params like `courseId` from deeply nested routes.
 */
export function getRouteParams(route: ActivatedRoute): Params {
  let params = route.snapshot.params;
  route.children?.forEach((c) => {
    params = { ...params, ...getRouteParams(c) };
  });
  return params;
}

/**
 * Collects route params from the current route and all its ancestors.
 * Useful for child components that need params defined on parent routes
 * (e.g., a KC component needing `courseId` and `unitId` from the parent unit route).
 */
export function getAllRouteParams(route: ActivatedRoute): Params {
  let params: Params = {};
  let current: ActivatedRoute | null = route;
  while (current) {
    params = { ...current.snapshot.params, ...params };
    current = current.parent;
  }
  return params;
}

/**
 * Subscribes to NavigationEnd events with automatic cleanup via takeUntilDestroyed().
 * Must be called in an injection context (constructor or field initializer).
 *
 * @param callback Called on each NavigationEnd with the URL and collected route params.
 */
export function onNavigationEnd(callback: (url: string, params: Params) => void): void {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  router.events
    .pipe(
      filter((e) => e instanceof NavigationEnd),
      takeUntilDestroyed(),
    )
    .subscribe((e) => {
      const params = getRouteParams(route);
      callback((e as NavigationEnd).urlAfterRedirects, params);
    });
}
