import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../modules/layout/home/home.component';
import {AboutComponent} from '../modules/layout/about/about.component';
import {PageNotFoundComponent} from '../modules/layout/page-not-found/page-not-found.component';
import {LoginComponent} from '../modules/learner/login/login.component';
import {RegisterComponent} from '../modules/learner/register/register.component';
import {AuthGuard} from './auth/auth.guard';
import {UnitComponent} from '../modules/domain/unit/unit.component';
import {KnowledgeComponentComponent} from '../modules/domain/knowledge-component/knowledge-component.component';
import {UnitResolver} from '../modules/domain/unit/unit.resolver';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'unit/:unitId', component: UnitComponent, resolve : {unit: UnitResolver}},
  {path: 'kc/:kcId', component: KnowledgeComponentComponent, canActivate: [AuthGuard]},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
