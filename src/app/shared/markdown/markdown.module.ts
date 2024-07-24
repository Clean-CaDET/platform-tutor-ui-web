import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { MarkdownModule } from 'ngx-markdown';
import { MarkdownPanelComponent } from './markdown-panel/markdown-panel.component';
import { ClipboardButtonComponent } from './clipboard-button/clipboard-button.component';


@NgModule({
  declarations: [MarkdownEditorComponent, MarkdownPanelComponent, ClipboardButtonComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MarkdownModule.forChild()
  ],
  exports: [
    MarkdownEditorComponent
  ]
})
export class TutorMarkdownModule { }
