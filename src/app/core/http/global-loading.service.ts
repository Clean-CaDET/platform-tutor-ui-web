import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalLoadingService {
  private readonly activeRequests = signal(0);
  readonly isLoading = signal(false);
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private shownAt = 0;
  private readonly debounceMs = 300;
  private readonly minVisibleMs = 500;

  increment(): void {
    this.activeRequests.update(n => n + 1);
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    if (!this.showTimer && !this.isLoading()) {
      this.showTimer = setTimeout(() => {
        this.showTimer = null;
        if (this.activeRequests() > 0) {
          this.shownAt = Date.now();
          this.isLoading.set(true);
        }
      }, this.debounceMs);
    }
  }

  decrement(): void {
    this.activeRequests.update(n => Math.max(0, n - 1));
    if (this.activeRequests() > 0) return;

    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
      return;
    }

    if (!this.isLoading()) return;

    const elapsed = Date.now() - this.shownAt;
    const remaining = this.minVisibleMs - elapsed;
    if (remaining > 0) {
      this.hideTimer = setTimeout(() => {
        this.hideTimer = null;
        if (this.activeRequests() === 0) this.isLoading.set(false);
      }, remaining);
    } else {
      this.isLoading.set(false);
    }
  }
}
