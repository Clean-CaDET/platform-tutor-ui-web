import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownModule } from 'ngx-markdown';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './infrastructure/app-routing.module';
import { MaterialModule } from './infrastructure/material.module';
import { ContentModule } from './modules/content/content.module';
import { NavbarModule } from './modules/navbar/navbar.module';
import { PagesModule } from './modules/pages/pages.module';
import { UsersModule } from './modules/users/users.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './keycloak/keycloak.init';
import { TeacherHomePageComponent } from './modules/teacher/teacher-home-page/teacher-home-page.component';
import {MatOptionModule} from '@angular/material/core';
import { TeacherCoursesComponent } from './modules/teacher/teacher-courses/teacher-courses.component';
import { TeacherLecturesComponent } from './modules/teacher/teacher-lectures/teacher-lectures.component';
import {MatTableModule} from '@angular/material/table';
import { TeacherSubscribeComponent } from './modules/teacher/teacher-subscribe/teacher-subscribe.component';


@NgModule({
  declarations: [
    AppComponent,
    TeacherHomePageComponent,
    TeacherCoursesComponent,
    TeacherLecturesComponent,
    TeacherSubscribeComponent,
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
    MatOptionModule,
    FormsModule,
    MatTableModule
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
