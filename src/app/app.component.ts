import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './core/auth/auth.service';
import { GlobalLoadingService } from './core/http/global-loading.service';
import { NavbarComponent } from './core/layout/navbar/navbar.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavbarComponent, MatProgressSpinnerModule, MatTooltipModule],
  template: `
    @if (user()) {
      <div class="shell">
        <div class="sidenav">
          <cc-navbar [isDarkMode]="isDarkMode()" (themeToggled)="toggleTheme()" />
          <mat-spinner class="global-spinner" [class.visible]="isLoading()" [diameter]="14" [strokeWidth]="4" matTooltip="Podaci se učitavaju" />
        </div>
        <div class="content">
          <router-outlet />
        </div>
      </div>
    } @else {
      <router-outlet />
    }
  `,
  styles: `
    :host {
      display: block;
      height: 100vh;
    }
    .shell {
      height: 100vh;
      display: flex;
      flex-direction: row;
    }
    .sidenav {
      position: relative;
      height: 100vh;
      flex: 0 0 85px;
      overflow: hidden;
    }
    .global-spinner {
      position: absolute;
      top: 28px;
      left: 48px;
      z-index: 100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 150ms ease-out;
      --mat-progress-spinner-active-indicator-color: var(--mat-sys-surface);
    }
    .global-spinner.visible {
      opacity: 1;
      pointer-events: auto;
    }
    .content {
      overflow-y: auto;
      height: 100%;
      width: 100%;
    }
  `,
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly globalLoading = inject(GlobalLoadingService);

  readonly user = this.authService.user;
  readonly isLoading = this.globalLoading.isLoading;
  readonly isDarkMode = signal(localStorage.getItem('theme') === 'Dark');

  constructor() {
    this.defineClientSessionId();

    effect(() => {
      document.documentElement.style.colorScheme = this.isDarkMode() ? 'dark' : 'light';
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((dark) => !dark);
    localStorage.setItem('theme', this.isDarkMode() ? 'Dark' : 'Light');
  }

  private defineClientSessionId(): void {
    const mobileRegex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const prefix = mobileRegex.test(navigator.userAgent) ? 'M' : 'D';
    const suffix = Math.random().toString(36).slice(-6);
    this.authService.clientId.set(prefix + suffix);
  }
}
