import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../modules/layout/home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthGuard} from './auth/auth.guard';
import {UnitComponent} from '../modules/domain/unit/unit.component';
import {KnowledgeComponentComponent} from '../modules/domain/knowledge-component/knowledge-component.component';
import { EventsTableComponent } from '../modules/learner-analytics/events-table/events-table.component';
import { KcmProgressComponent } from '../modules/learner-analytics/kcm-progress/kcm-progress.component';
import { KcStatisticsComponent } from '../modules/learner-analytics/kc-statistics/kc-statistics.component';
import {CourseComponent} from '../modules/domain/course/course.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},

  {path: 'unit/:unitId', component: UnitComponent, canActivate: [AuthGuard], data: {role: 'learner'}},
  {path: 'unit/:unitId/kc/:kcId', component: KnowledgeComponentComponent, canActivate: [AuthGuard], data: {role: 'learner'}},

  {path: 'analytics/events', component: EventsTableComponent, canActivate: [AuthGuard], data: {role: 'instructor'}},
  {path: 'analytics/kc-statistics', component: KcStatisticsComponent, canActivate: [AuthGuard], data: {role: 'instructor'}},
  {path: 'course/:courseId/learner-progress/:unitId', component: KcmProgressComponent, canActivate: [AuthGuard], data: {role: 'instructor'}},
  {path: 'courses/:courseId', component: CourseComponent, canActivate: [AuthGuard], data: {role: 'instructor'}},

  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {paramsInheritanceStrategy: 'always'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
