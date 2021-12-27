import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MarkdownModule} from 'ngx-markdown';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './infrastructure/app-routing.module';
import {MaterialModule} from './infrastructure/material.module';
import {ContentModule} from './modules/domain/content.module';
import {NavbarModule} from './modules/navbar/navbar.module';
import {PagesModule} from './modules/pages/pages.module';
import {LearnersModule} from './modules/learner/learners.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {initializeKeycloak} from './infrastructure/auth/keycloak/keycloak.init';
import {NotesModule} from './modules/notes/notes.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';


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
    ContentModule,
    NavbarModule,
    PagesModule,
    LearnersModule,
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
    KeycloakAngularModule,
    NotesModule,
    MatSlideToggleModule,
    FormsModule,
    MatIconModule
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
export class AppModule {
}
