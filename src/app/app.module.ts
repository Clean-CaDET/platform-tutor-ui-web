import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home/home.component';
import { AboutComponent } from './home/about/about.component';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { AppRoutingModule } from './infrastructure/app-routing.module';
import { MaterialModule } from './infrastructure/material.module';
import { NavbarComponent } from './home/navbar/navbar.component';
import { LectureComponent } from './lecture/lecture.component';
import { KnowledgeNodeModule } from './lecture/knowledge-node/knowledge-node.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    PageNotFoundComponent,
    NavbarComponent,
    LectureComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    KnowledgeNodeModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
