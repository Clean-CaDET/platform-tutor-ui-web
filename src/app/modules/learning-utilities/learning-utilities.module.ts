import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { UnitNotesComponent } from './notes/unit-notes/unit-notes.component';
import { EmbeddedNotesComponent } from './notes/embedded-notes/embedded-notes.component';
import { TutorMarkdownModule } from 'src/app/shared/markdown/markdown.module';

@NgModule({
  declarations: [UnitNotesComponent, EmbeddedNotesComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MarkdownModule.forChild(),
    ReactiveFormsModule,
    TutorMarkdownModule
  ],
  exports: [UnitNotesComponent, EmbeddedNotesComponent],
})
export class LearningUtilitiesModule {}
