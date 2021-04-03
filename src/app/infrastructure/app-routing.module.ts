import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../home/home/home.component';
import {AboutComponent} from '../home/about/about.component';
import {PageNotFoundComponent} from '../home/page-not-found/page-not-found.component';
import {LectureComponent} from '../lecture/lecture.component';
import {KnowledgeNodeComponent} from '../lecture/knowledge-node/knowledge-node.component';
import {KeycloakTestComponent} from '../keycloak/keycloak-test/keycloak-test.component';
import {AuthGuard} from '../keycloak/authguard/auth.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'lecture/:lectureId', component: LectureComponent},
  {path: 'node/:nodeId', component: KnowledgeNodeComponent},
  {path: 'keycloak', loadChildren: () => import('../keycloak/keycloak.module').then(m => m.KeycloakModule)},
  {path: 'keycloaktest', canActivate: [AuthGuard], component: KeycloakTestComponent}, // Only purpose of this is to test keycloak login.
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
