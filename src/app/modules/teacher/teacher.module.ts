import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../infrastructure/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TeacherHomePageComponent} from './teacher-home-page/teacher-home-page.component';
import {TeacherCoursesComponent} from './teacher-courses/teacher-courses.component';
import {TeacherLecturesComponent} from './teacher-lectures/teacher-lectures.component';
import {TeacherSubscribeComponent} from './teacher-subscribe/teacher-subscribe.component';


@NgModule({
  declarations: [
    TeacherHomePageComponent,
    TeacherCoursesComponent,
    TeacherLecturesComponent,
    TeacherSubscribeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule
  ]
})
export class TeacherModule {
}
