import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../infrastructure/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TeacherCreateKnowledgeNodeComponent} from './teacher-create-knowledge-node/teacher-create-knowledge-node.component';
import { KnowledgeNodeListComponent } from './knowledge-node-list/knowledge-node-list.component';
import {ContentModule} from '../content/content.module';
import { CreateLearningObjectSummaryComponent } from './create-learning-object-summary/create-learning-object-summary.component';

@NgModule({
  declarations: [
    TeacherCreateKnowledgeNodeComponent,
    KnowledgeNodeListComponent,
    CreateLearningObjectSummaryComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    ContentModule
  ]
})
export class TeacherModule {
}
