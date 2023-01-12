import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { CourseStructureComponent } from './course-structure/course-structure.component';
import { CourseDetailsComponent } from './course-structure/course-details/course-details.component';
import { UnitDetailsComponent } from './course-structure/unit-details/unit-details.component';
import { KcTreeComponent } from './knowledge-component/kc-tree/kc-tree.component';
import { TutorMarkdownModule } from 'src/app/shared/markdown/markdown.module';
import { InstructionalItemsComponent } from './knowledge-component/instructional-items/instructional-items.component';
import { RouterModule } from '@angular/router';
import { KnowledgeComponentAuthoringComponent } from './knowledge-component/knowledge-component-authoring.component';
import { KcFormComponent } from './knowledge-component/kc-form/kc-form.component';

@NgModule({
  declarations: [
    CourseStructureComponent,
    CourseDetailsComponent,
    UnitDetailsComponent,
    KcTreeComponent,
    KcFormComponent,
    InstructionalItemsComponent,
    KnowledgeComponentAuthoringComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    TutorMarkdownModule
  ]
})
export class AuthoringModule { }
