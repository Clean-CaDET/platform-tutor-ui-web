import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

/**
 * Collects all route params from the entire active route tree (root → deepest child).
 * Works identically regardless of where the calling component sits in the hierarchy.
 */
export function getRouteParams(route: ActivatedRoute): Params {
  let params: Params = {};
  let current: ActivatedRoute | null = route.root;
  while (current) {
    if (current.snapshot) {
      params = { ...params, ...current.snapshot.params };
    }
    current = current.firstChild;
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
