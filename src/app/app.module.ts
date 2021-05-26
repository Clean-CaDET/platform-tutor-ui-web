import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home/home.component';
import { AboutComponent } from './home/about/about.component';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { AppRoutingModule } from './infrastructure/app-routing.module';
import { MaterialModule } from './infrastructure/material.module';
import { NavbarComponent } from './home/navbar/navbar.component';
import { LectureModule } from './lecture/lecture.module';
import { LoginComponent } from './trainee/login/login.component';
import { RegisterComponent } from './trainee/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {initializeKeycloak} from './keycloak/keycloak.init';
import { KeycloakLoginComponent } from './keycloak-login/keycloak-login.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    PageNotFoundComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    KeycloakLoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    LectureModule,
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
    KeycloakAngularModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
