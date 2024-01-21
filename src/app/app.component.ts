import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthenticationService } from './infrastructure/auth/auth.service';

@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isDarkTheme = true;

  constructor(
    private authService: AuthenticationService,
    private overlayContainer: OverlayContainer
  ) {}

  ngOnInit(): void {
    this.isDarkTheme = localStorage.getItem('theme') === 'Dark';
    this.applyThemeOnLayers();
    this.checkIfUserExists();
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
}
