import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { NavbarComponent } from './core/layout/navbar/navbar.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    @if (user()) {
      <div class="shell">
        <div class="sidenav">
          <cc-navbar [isDarkMode]="isDarkMode()" (themeToggled)="toggleTheme()" />
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
      height: 100vh;
      flex: 0 0 85px;
      overflow: hidden;
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

  readonly user = this.authService.user;
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
