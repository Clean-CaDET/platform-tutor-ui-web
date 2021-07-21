import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesComponent } from './notes.component';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../infrastructure/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    NotesComponent,
    MarkdownEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    NotesComponent
  ]
})
export class NotesModule { }
