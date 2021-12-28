import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../modules/layout/home/home.component';
import {LoginComponent} from '../modules/learner/login/login.component';
import {RegisterComponent} from '../modules/learner/register/register.component';
import {AuthGuard} from './auth/auth.guard';
import {UnitComponent} from '../modules/domain/unit/unit.component';
import {KnowledgeComponentComponent} from '../modules/domain/knowledge-component/knowledge-component.component';
import {UnitResolver} from '../modules/domain/unit/unit.resolver';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'unit/:unitId', component: UnitComponent, resolve : {unit: UnitResolver}, canActivate: [AuthGuard]},
  {path: 'kc/:kcId', component: KnowledgeComponentComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
