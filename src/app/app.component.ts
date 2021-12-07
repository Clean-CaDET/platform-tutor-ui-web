import {Component, Input, OnInit} from '@angular/core';
import {LearnerService} from './modules/users/learner.service';
import {Learner} from './modules/users/model/learner.model';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  opened = false;
  isDarkTheme = true;
  learner: Learner;

  constructor(private learnerService: LearnerService, private overlayContainer: OverlayContainer) {
  }

  ngOnInit(): void {
    this.opened = true;
    this.learnerService.learner$.subscribe(learner => this.learner = learner);
    this.applyThemeOnLayers();
  }

  changeTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyThemeOnLayers();
  }

  applyThemeOnLayers(): void {
    const themeToAdd = this.isDarkTheme ? 'dark-theme-mode' : 'light-theme-mode';
    const themeToRemove = !this.isDarkTheme ? 'dark-theme-mode' : 'light-theme-mode';
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    overlayContainerClasses.remove(themeToRemove);
    overlayContainerClasses.add(themeToAdd);
  }
}
