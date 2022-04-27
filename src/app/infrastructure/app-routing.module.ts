import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../modules/layout/home/home.component';
import {LoginComponent} from '../modules/learner/login/login.component';
import {AuthGuard} from './auth/auth.guard';
import {UnitComponent} from '../modules/domain/unit/unit.component';
import {KnowledgeComponentComponent} from '../modules/domain/knowledge-component/knowledge-component.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'unit/:unitId', component: UnitComponent, canActivate: [AuthGuard]},
  {path: 'unit/:unitId/kc/:kcId', component: KnowledgeComponentComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {paramsInheritanceStrategy: 'always'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
