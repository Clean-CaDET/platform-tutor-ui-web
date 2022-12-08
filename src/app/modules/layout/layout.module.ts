import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { AppRoutingModule } from 'src/app/infrastructure/app-routing.module';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { LearningModule } from '../learning/learning.module';
import { HomeComponent } from './home/home.component';
import { InstructorControlsComponent } from './navbar/instructor-controls/instructor-controls.component';
import { LearnerControlsComponent } from './navbar/learner-controls/learner-controls.component';
import { NavbarComponent } from './navbar/navbar.component';

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
