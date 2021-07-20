import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../modules/pages/home/home.component';
import { AboutComponent } from '../modules/pages/about/about.component';
import { PageNotFoundComponent } from '../modules/pages/page-not-found/page-not-found.component';
import { LectureComponent } from '../modules/lecture/lecture.component';
import { KnowledgeNodeComponent } from '../modules/lecture/knowledge-node/knowledge-node.component';
import { LoginComponent } from '../modules/users/login/login.component';
import { RegisterComponent } from '../modules/users/register/register.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'lecture/:lectureId', component: LectureComponent},
  { path: 'node/:nodeId', component: KnowledgeNodeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
