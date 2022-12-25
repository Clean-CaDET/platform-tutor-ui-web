import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnersComponent } from './stakeholders/learners/learners.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { GenericsModule } from 'src/app/shared/generics/generics.module';
import { InstructorsComponent } from './stakeholders/instructors/instructors.component';
import { CoursesComponent } from './courses/courses.component';
import { OwnedCoursesComponent } from './stakeholders/instructors/owned-courses/owned-courses.component';
import { OwnersComponent } from './courses/owners/owners.component';
import { EnrolledLearnersComponent } from './courses/enrolled-learners/enrolled-learners.component';
import { BulkAddComponent } from './stakeholders/learners/bulk-add/bulk-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BulkEnrollLearnersComponent } from './courses/bulk-enroll-learners/bulk-enroll-learners.component';



@NgModule({
  declarations: [
    LearnersComponent,
    InstructorsComponent,
    CoursesComponent,
    OwnedCoursesComponent,
    OwnersComponent,
    EnrolledLearnersComponent,
    BulkAddComponent,
    BulkEnrollLearnersComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GenericsModule,
    ReactiveFormsModule
  ]
})
export class ManagementModule { }
