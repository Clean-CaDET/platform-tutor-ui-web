import {Component, OnInit} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import {LearnerService} from './infrastructure/auth/learner.service';
import {Learner} from './infrastructure/auth/learner.model';
import {ACCESS_TOKEN} from './shared/constants';

@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  opened = false;
  isDarkTheme = true;

  constructor(private learnerService: LearnerService, private overlayContainer: OverlayContainer) {
  }

  ngOnInit(): void {
    this.opened = true;
    this.isDarkTheme = localStorage.getItem('theme') === 'Dark';
    this.applyThemeOnLayers();
    this.setUser();
  }

  changeTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyThemeOnLayers();
    this.storeThemeSelection();
  }

  private applyThemeOnLayers(): void {
    const themeToAdd = this.isDarkTheme ? 'dark-theme-mode' : 'light-theme-mode';
    const themeToRemove = !this.isDarkTheme ? 'dark-theme-mode' : 'light-theme-mode';
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    overlayContainerClasses.remove(themeToRemove);
    overlayContainerClasses.add(themeToAdd);
  }

  private storeThemeSelection(): void {
    localStorage.setItem('theme', this.isDarkTheme ? 'Dark' : 'Light');
  }

  private setUser(): void {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken == null) { return; }
    const decodedJWT = JSON.parse(window.atob(accessToken.split('.')[1]));
    const learner = new Learner({id: +decodedJWT.id}); // TODO: We should add User model in future.
    this.learnerService.setLearner(learner);
  }
}
