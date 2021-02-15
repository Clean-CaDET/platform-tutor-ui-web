import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../home/home/home.component';
import {AboutComponent} from '../home/about/about.component';
import {PageNotFoundComponent} from '../home/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
