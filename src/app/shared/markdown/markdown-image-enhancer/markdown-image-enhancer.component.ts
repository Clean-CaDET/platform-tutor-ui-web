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
    .modal-container { text-align: center; padding: 1rem; }
    .full-image { max-width: 100%; max-height: 100%; }
  `,
})
export class MarkdownImageEnhancerComponent {
  private readonly data = inject<{ src: string }>(MAT_DIALOG_DATA);
  readonly imageSrc = this.data.src;
}
