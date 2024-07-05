import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { NotesComponent } from './notes/notes.component';
import { TutorMarkdownModule } from 'src/app/shared/markdown/markdown.module';

@NgModule({
  declarations: [NotesComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MarkdownModule.forChild(),
    ReactiveFormsModule,
    TutorMarkdownModule
  ],
  exports: [NotesComponent],
})
export class LearningUtilitiesModule {}
