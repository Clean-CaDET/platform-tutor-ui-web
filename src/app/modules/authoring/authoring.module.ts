import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { CourseStructureComponent } from './course-structure/course-structure.component';
import { CourseDetailsComponent } from './course-structure/course-details/course-details.component';
import { UnitTableComponent } from './course-structure/unit-table/unit-table.component';
import { KcTreeComponent } from './course-structure/kc-tree/kc-tree.component';

@NgModule({
  declarations: [
    CourseStructureComponent,
    CourseDetailsComponent,
    UnitTableComponent,
    KcTreeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class AuthoringModule { }
