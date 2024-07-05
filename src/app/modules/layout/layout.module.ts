import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { AppRoutingModule } from 'src/app/infrastructure/app-routing.module';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { LearningModule } from '../learning/learning.module';
import { CourseCardComponent } from './home/dashboard/course-card/course-card.component';
import { HomeComponent } from './home/home.component';
import { InstructorControlsComponent } from './navbar/instructor-controls/instructor-controls.component';
import { LearnerControlsComponent } from './navbar/learner-controls/learner-controls.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { AdminControlsComponent } from './navbar/admin-controls/admin-controls.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    LearnerControlsComponent,
    InstructorControlsComponent,
    CourseCardComponent,
    DashboardComponent,
    AdminControlsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    MaterialModule,
    MarkdownModule,
    LearningModule,
    AppRoutingModule,
  ],
  exports: [NavbarComponent],
})
export class LayoutModule {}
