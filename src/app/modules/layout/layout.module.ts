import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LayoutModule { }
