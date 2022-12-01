import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../infrastructure/material.module';
import { FlexModule } from '@angular/flex-layout';
import { MarkdownModule } from 'ngx-markdown';
import { InstructorControlsComponent } from './navbar/instructor-controls/instructor-controls.component';
import { LearnerControlsComponent } from './navbar/learner-controls/learner-controls.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LearningModule } from '../learning/learning.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/infrastructure/app-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    LearnerControlsComponent,
    InstructorControlsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    MaterialModule,
    FlexModule,
    MarkdownModule,
    LearningModule,
    AppRoutingModule,
  ],
  exports: [NavbarComponent],
})
export class LayoutModule {}
