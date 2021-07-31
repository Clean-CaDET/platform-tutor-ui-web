import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../modules/pages/home/home.component';
import { AboutComponent } from '../modules/pages/about/about.component';
import { PageNotFoundComponent } from '../modules/pages/page-not-found/page-not-found.component';
import { LectureComponent } from '../modules/content/lecture/lecture.component';
import { KnowledgeNodeComponent } from '../modules/content/knowledge-node/knowledge-node.component';
import { LoginComponent } from '../modules/users/login/login.component';
import { RegisterComponent } from '../modules/users/register/register.component';
import { AuthGuard } from './guard/auth.guard';
import {TeacherHomePageComponent} from '../modules/teacher/teacher-home-page/teacher-home-page.component';
import {TeacherCoursesComponent} from '../modules/teacher/teacher-courses/teacher-courses.component';
import {TeacherLecturesComponent} from '../modules/teacher/teacher-lectures/teacher-lectures.component';
import {TeacherSubscribeComponent} from '../modules/teacher/teacher-subscribe/teacher-subscribe.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'lecture/:lectureId', component: LectureComponent},
  { path: 'node/:nodeId', component: KnowledgeNodeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'teacher', component: TeacherHomePageComponent},
  { path: 'teacher/courses', component: TeacherCoursesComponent},
  { path: 'teacher/lectures', component: TeacherLecturesComponent},
  { path: 'teacher/subscribe', component: TeacherSubscribeComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
