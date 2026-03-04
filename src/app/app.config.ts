import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { AuthService } from './core/auth/auth.service';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideMarkdown, CLIPBOARD_OPTIONS } from 'ngx-markdown';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { ClipboardButtonComponent } from './shared/markdown/clipboard-button/clipboard-button.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => inject(AuthService).checkIfUserExists()),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideMarkdown({
      clipboardOptions: {
        provide: CLIPBOARD_OPTIONS,
        useValue: { buttonComponent: ClipboardButtonComponent },
      },
    }),
  ],
};
