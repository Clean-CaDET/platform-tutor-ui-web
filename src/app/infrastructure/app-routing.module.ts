import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home/home.component';
import { AboutComponent } from '../home/about/about.component';
import { PageNotFoundComponent } from '../home/page-not-found/page-not-found.component';
import { LectureComponent } from '../lecture/lecture.component';
import { KnowledgeNodeComponent } from '../lecture/knowledge-node/knowledge-node.component';
import { LoginComponent } from '../trainee/login/login.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'lecture/:lectureId', component: LectureComponent},
  { path: 'node/:nodeId', component: KnowledgeNodeComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
