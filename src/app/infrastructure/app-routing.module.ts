import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../modules/layout/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UnitComponent } from '../modules/learning/unit/unit.component';
import { KnowledgeComponentComponent } from '../modules/learning/knowledge-component/knowledge-component.component';
import { EventsTableComponent } from '../modules/domain-knowledge-analytics/events-table/events-table.component';
import { CourseComponent } from '../modules/learning/course/course.component';
import { KcmProgressComponent } from '../modules/group-monitoring/kcm-progress/kcm-progress.component';
import { KcStatisticsComponent } from '../modules/domain-knowledge-analytics/kc-statistics/kc-statistics.component';
import { StakeholdersComponent } from '../modules/management/stakeholders/stakeholders/stakeholders.component';

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
    component: EventsTableComponent,
    canActivate: [AuthGuard],
    data: { role: 'instructor' },
  },
  {
    path: 'analytics/kc-statistics',
    component: KcStatisticsComponent,
    canActivate: [AuthGuard],
    data: { role: 'instructor' },
  },
  {
    path: 'course/:courseId/learner-progress/:unitId',
    component: KcmProgressComponent,
    canActivate: [AuthGuard],
    data: { role: 'instructor' },
  },
  {
    path: 'management/stakeholders/:type',
    component: StakeholdersComponent,
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
