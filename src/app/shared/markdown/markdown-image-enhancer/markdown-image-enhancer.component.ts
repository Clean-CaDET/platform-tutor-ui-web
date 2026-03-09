import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'cc-markdown-image-enhancer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-container">
      <img [src]="imageSrc" class="full-image" />
    </div>
  `,
  styles: `
    .modal-container { text-align: center; margin: 10px }
    .full-image { max-width: 90%; max-height: 90%; }
  `,
})
export class MarkdownImageEnhancerComponent {
  private readonly data = inject<{ src: string }>(MAT_DIALOG_DATA);
  readonly imageSrc = this.data.src;
}
