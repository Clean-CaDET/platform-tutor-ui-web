import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MarkdownModule} from 'ngx-markdown';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './infrastructure/app-routing.module';
import {MaterialModule} from './infrastructure/material.module';
import {ContentModule} from './modules/content/content.module';
import {NavbarModule} from './modules/navbar/navbar.module';
import {PagesModule} from './modules/pages/pages.module';
import {UsersModule} from './modules/users/users.module';
import {ReactiveFormsModule} from '@angular/forms';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {initializeKeycloak} from './keycloak/keycloak.init';
import {NotesModule} from './modules/notes/notes.module';


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
    UsersModule,
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
    KeycloakAngularModule,
    NotesModule
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
