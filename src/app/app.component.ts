import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthenticationService } from './infrastructure/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  initCompleted: boolean = false;
  isDarkTheme: boolean = true;

  constructor(
    private http: HttpClient, private authService: AuthenticationService, private overlayContainer: OverlayContainer
  ) {}

  ngOnInit(): void {
    this.checkVersion().subscribe(_ => {
      this.isDarkTheme = localStorage.getItem('theme') === 'Dark';
      this.applyThemeOnLayers();
      this.checkIfUserExists();
      this.defineClientSessionId();
      this.initCompleted = true;
    });
  }

  checkVersion(): Observable<string> {
    return this.http.get<string>(environment.apiHost + 'version', { responseType: 'text' as 'json' }).pipe(tap(serverVersion => {
      if(serverVersion !== localStorage.getItem('version')) {
        localStorage.setItem('version', serverVersion);
        const url = new URL(window.location.href);
        url.searchParams.set('v', serverVersion);
        window.location.href = url.toString();
      }
    }));
  }
  
  changeTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyThemeOnLayers();
    this.storeThemeSelection();
  }

  private applyThemeOnLayers(): void {
    const themeToAdd = this.isDarkTheme
      ? 'dark-theme-mode'
      : 'light-theme-mode';
    const themeToRemove = !this.isDarkTheme
      ? 'dark-theme-mode'
      : 'light-theme-mode';
    const overlayContainerClasses =
      this.overlayContainer.getContainerElement().classList;
    overlayContainerClasses.remove(themeToRemove);
    overlayContainerClasses.add(themeToAdd);
  }

  private storeThemeSelection(): void {
    localStorage.setItem('theme', this.isDarkTheme ? 'Dark' : 'Light');
  }

  private checkIfUserExists(): void {
    this.authService.checkIfUserExists();
  }

  private defineClientSessionId() {
    const mobileClientRegex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    let prefix = mobileClientRegex.test(navigator.userAgent) ? 'M' : 'D';
    let randomSufix = Math.random().toString(36).slice(-6);
    this.authService.clientId$.next(prefix + randomSufix);
  }
}
