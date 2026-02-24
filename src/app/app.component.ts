import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  styles: `
    :host {
      display: block;
      height: 100vh;
    }
  `,
})
export class AppComponent {
  private readonly authService = inject(AuthService);

  readonly isDarkMode = signal(localStorage.getItem('theme') === 'Dark');

  constructor() {
    this.authService.checkIfUserExists();
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
