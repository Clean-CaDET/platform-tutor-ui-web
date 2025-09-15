import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { UnitNotesComponent } from './notes/unit-notes/unit-notes.component';
import { CourseNotesComponent } from './notes/course-notes/course-notes.component';
import { TutorMarkdownModule } from 'src/app/shared/markdown/markdown.module';

@NgModule({
  declarations: [UnitNotesComponent, CourseNotesComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MarkdownModule.forChild(),
    ReactiveFormsModule,
    TutorMarkdownModule
  ],
  exports: [UnitNotesComponent, CourseNotesComponent],
})
export class LearningUtilitiesModule {}
