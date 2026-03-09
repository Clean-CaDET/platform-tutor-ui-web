import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { CcMarkdownComponent } from '../cc-markdown.component';

@Component({
  selector: 'cc-markdown-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogContent, CcMarkdownComponent],
  template: `
    <mat-dialog-content style="overflow-y: auto; padding: 5px">
      <cc-markdown [lineNumbers]="true">{{ markdown }}</cc-markdown>
    </mat-dialog-content>
  `,
})
export class MarkdownPanelComponent {
  private readonly data = inject<{ markdown: string }>(MAT_DIALOG_DATA);
  readonly markdown = this.data.markdown;
}
