import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/infrastructure/app-routing.module';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { LearningModule } from '../../learning/learning.module';
import { InstructorControlsComponent } from './instructor-controls/instructor-controls.component';
import { LearnerControlsComponent } from './learner-controls/learner-controls.component';
import { NavbarComponent } from './navbar.component';

@NgModule({
  declarations: [
    NavbarComponent,
    LearnerControlsComponent,
    InstructorControlsComponent,
  ],
  imports: [BrowserModule, MaterialModule, AppRoutingModule, LearningModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
