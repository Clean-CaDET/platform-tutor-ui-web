import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'cc-markdown-panel',
  templateUrl: './markdown-panel.component.html',
  styleUrls: ['./markdown-panel.component.scss']
})
export class MarkdownPanelComponent {
  markdown: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.markdown = data.markdown;
  }
}
