import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { CourseStructureComponent } from './course-structure/course-structure.component';
import { CourseDetailsComponent } from './course-structure/course-details/course-details.component';
import { UnitDetailsComponent } from './course-structure/unit-details/unit-details.component';
import { KcTreeComponent } from './course-structure/kc-tree/kc-tree.component';
import { TutorMarkdownModule } from 'src/app/shared/markdown/markdown.module';
import { KcFormComponent } from './course-structure/kc-form/kc-form.component';
import { InstructionalItemsComponent } from './instructional-items/instructional-items.component';

@NgModule({
  declarations: [
    CourseStructureComponent,
    CourseDetailsComponent,
    UnitDetailsComponent,
    KcTreeComponent,
    KcFormComponent,
    InstructionalItemsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    TutorMarkdownModule
  ]
})
export class AuthoringModule { }
