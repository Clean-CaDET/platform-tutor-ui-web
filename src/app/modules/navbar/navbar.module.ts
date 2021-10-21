import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NavbarComponent } from './navbar.component';
import { MaterialModule } from '../../infrastructure/material.module';
import { AppRoutingModule } from '../../infrastructure/app-routing.module';



@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
