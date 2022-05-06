import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../modules/layout/home/home.component';
import {LoginComponent} from '../modules/learner/login/login.component';
import {AuthGuard} from './auth/auth.guard';
import {UnitComponent} from '../modules/domain/unit/unit.component';
import {KnowledgeComponentComponent} from '../modules/domain/knowledge-component/knowledge-component.component';
import { EventsTableComponent } from '../modules/learner-analytics/events-table/events-table.component';
import { KcmProgressComponent } from '../modules/learner-analytics/kcm-progress/kcm-progress.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'unit/:unitId', component: UnitComponent, canActivate: [AuthGuard], data: {role: 'learner'}},
  {path: 'unit/:unitId/kc/:kcId', component: KnowledgeComponentComponent, canActivate: [AuthGuard], data: {role: 'learner'}},
  {path: 'analytics/events', component: EventsTableComponent, canActivate: [AuthGuard], data: {role: 'instructor'}},
  {path: 'analytics/learner-progress', component: KcmProgressComponent, canActivate: [AuthGuard], data: {role: 'instructor'}},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {paramsInheritanceStrategy: 'always'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
