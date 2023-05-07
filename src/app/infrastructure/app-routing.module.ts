import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../modules/layout/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UnitComponent } from '../modules/learning/unit/unit.component';
import { KnowledgeComponentComponent } from '../modules/learning/knowledge-component/knowledge-component.component';
import { CourseComponent } from '../modules/learning/course/course.component';
import { GroupMonitoringComponent } from '../modules/monitoring/group-monitoring/group-monitoring.component';
import { LearnersComponent } from '../modules/management/stakeholders/learners/learners.component';
import { KcStatisticsComponent } from '../modules/knowledge-analytics/kc-statistics/kc-statistics.component';
import { InstructorsComponent } from '../modules/management/stakeholders/instructors/instructors.component';
import { CoursesComponent } from '../modules/management/courses/courses.component';
import { CourseStructureComponent } from '../modules/authoring/course-structure/course-structure.component';
import { InstructionalItemsComponent } from '../modules/authoring/knowledge-component/instructional-items/instructional-items.component';
import { KnowledgeComponentAuthoringComponent } from '../modules/authoring/knowledge-component/knowledge-component-authoring.component';
import { AssessmentItemsComponent } from '../modules/authoring/assessment-items/assessment-items.component';
import {
  SessionEventsComponent
} from "../modules/monitoring/group-monitoring/learner-progress/calendar/session-events/session-events.component";
import {CalendarComponent} from "../modules/monitoring/group-monitoring/learner-progress/calendar/calendar.component";




const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'courses/:courseId', component: CourseComponent },

  {
    path: 'course/:courseId/unit/:unitId',
    component: UnitComponent,
    canActivate: [AuthGuard],
    data: { role: 'learner' },
  },
  {
    path: 'course/:courseId/unit/:unitId/kc/:kcId',
    component: KnowledgeComponentComponent,
    canActivate: [AuthGuard],
    data: { role: 'learner' },
  },

  {
    path: 'analytics/events',
    component: SessionEventsComponent,
    canActivate: [AuthGuard],
    data: { role: 'instructor' },
  },
  {
    path: 'analytics/:courseId/kc-statistics',
    component: KcStatisticsComponent,
    canActivate: [AuthGuard],
    data: { role: 'instructor' },
  },
  {
    path: 'monitoring/:courseId/progress',
    component: GroupMonitoringComponent,
    canActivate: [AuthGuard],
    data: { role: 'instructor' },
  },
  {
    path: 'authoring/course/:courseId',
    component: CourseStructureComponent,
    canActivate: [AuthGuard],
    data: { role: 'instructor' },
  },
  {
    path: 'authoring/course/:courseId/knowledge-component/:kcId',
    component: KnowledgeComponentAuthoringComponent,
    canActivate: [AuthGuard],
    data: { role: 'instructor' },
    children: [
      {
        path: 'instruction',
        component: InstructionalItemsComponent
      },
      {
        path: 'assessments',
        component: AssessmentItemsComponent
      }
    ]
  },
  { path: 'calendar/:learnerId', component: CalendarComponent,
    canActivate: [AuthGuard],
    data: { role: 'instructor' }
  },

  {
    path: 'management/stakeholders/learners',
    component: LearnersComponent,
    canActivate: [AuthGuard],
    data: { role: 'administrator' },
  },
  {
    path: 'management/stakeholders/instructors',
    component: InstructorsComponent,
    canActivate: [AuthGuard],
    data: { role: 'administrator' },
  },
  {
    path: 'management/courses',
    component: CoursesComponent,
    canActivate: [AuthGuard],
    data: { role: 'administrator' },
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
