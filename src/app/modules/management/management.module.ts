import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnersComponent } from './stakeholders/learners/learners.component';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { GenericsModule } from 'src/app/shared/generics/generics.module';
import { InstructorsComponent } from './stakeholders/instructors/instructors.component';
import { CoursesComponent } from './courses/courses.component';
import { OwnedCoursesComponent } from './stakeholders/instructors/owned-courses/owned-courses.component';



@NgModule({
  declarations: [
    LearnersComponent,
    InstructorsComponent,
    CoursesComponent,
    OwnedCoursesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GenericsModule
  ]
})
export class ManagementModule { }
