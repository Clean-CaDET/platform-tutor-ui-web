import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { MarkdownEditorComponent } from './notes/markdown-editor/markdown-editor.component';
import { NotesComponent } from './notes/notes.component';
import { TutorImprovementComponent } from './tutor-improvement/tutor-improvement.component';

@NgModule({
  declarations: [
    NotesComponent,
    MarkdownEditorComponent,
    TutorImprovementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    MarkdownModule.forChild(),
    ReactiveFormsModule,
  ],
  exports: [NotesComponent, TutorImprovementComponent],
})
export class LearningUtilitiesModule {}
