import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotesModule} from './modules/domain/notes/notes.module';
import {AuthenticationModule} from './infrastructure/auth/auth.module';
import {JwtInterceptor} from './infrastructure/auth/jwt/jwt.interceptor';
import { LearnerAnalyticsModule } from './modules/learner-analytics/learner-analytics.module';

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
    AuthenticationModule,
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
    LayoutModule,
    NavbarModule,
    DomainModule,
    NotesModule,
    FormsModule,
    LearnerAnalyticsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
