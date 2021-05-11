import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home/home.component';
import { AboutComponent } from '../home/about/about.component';
import { PageNotFoundComponent } from '../home/page-not-found/page-not-found.component';
import { LectureComponent } from '../lecture/lecture.component';
import { KnowledgeNodeComponent } from '../lecture/knowledge-node/knowledge-node.component';
import { LoginComponent } from '../trainee/login/login.component';
import { RegisterComponent } from '../trainee/register/register.component';
import { AuthGuard } from './guard/auth.guard';
import {KeycloakLoginComponent} from '../keycloak-login/keycloak-login.component';
import {KeycloakGuard} from '../keycloak/keycloak.auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'lecture/:lectureId', component: LectureComponent},
  { path: 'node/:nodeId', component: KnowledgeNodeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'test', component: KeycloakLoginComponent, canActivate: [KeycloakGuard]},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
