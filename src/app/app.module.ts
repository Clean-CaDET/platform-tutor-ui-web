import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MarkdownModule} from 'ngx-markdown';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './infrastructure/app-routing.module';
import {MaterialModule} from './infrastructure/material.module';
import {DomainModule} from './modules/domain/domain.module';
import {NavbarModule} from './modules/layout/navbar/navbar.module';
import {LayoutModule} from './modules/layout/layout.module';
import {LearnersModule} from './modules/learner/learners.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {initializeKeycloak} from './infrastructure/auth/keycloak/keycloak.init';
import {NotesModule} from './modules/domain/notes/notes.module';
import {JwtInterceptor} from './infrastructure/auth/jwt/jwt.interceptor';
import { AnalyticsInstructorModule } from './modules/analytics-instructor/analytics-instructor.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    LearnersModule,
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
    KeycloakAngularModule,
    LayoutModule,
    NavbarModule,
    DomainModule,
    NotesModule,
    FormsModule,
    AnalyticsInstructorModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
