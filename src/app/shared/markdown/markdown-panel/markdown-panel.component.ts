import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'cc-markdown-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogContent, MarkdownComponent],
  template: `
    <mat-dialog-content style="overflow-y: auto; padding: 5px">
      <markdown lineNumbers>{{ markdown }}</markdown>
    </mat-dialog-content>
  `,
})
export class MarkdownPanelComponent {
  private readonly data = inject<{ markdown: string }>(MAT_DIALOG_DATA);
  readonly markdown = this.data.markdown;
}
