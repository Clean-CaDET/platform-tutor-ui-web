import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../../infrastructure/material.module';
import {FlexModule} from '@angular/flex-layout';
import {MarkdownModule} from 'ngx-markdown';

@NgModule({
  declarations: [
    HomeComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        FlexModule,
        MarkdownModule
    ]
})
export class LayoutModule { }
