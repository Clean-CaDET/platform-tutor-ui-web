import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NavbarComponent } from './navbar.component';
import { MaterialModule } from '../../../infrastructure/material.module';
import { AppRoutingModule } from '../../../infrastructure/app-routing.module';
import {DomainModule} from '../../domain/domain.module';
import { LearnerControlsComponent } from './learner-controls/learner-controls.component';

@NgModule({
  declarations: [
    NavbarComponent,
    LearnerControlsComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    DomainModule
  ],
  exports: [
    NavbarComponent,
  ]
})
export class NavbarModule { }
