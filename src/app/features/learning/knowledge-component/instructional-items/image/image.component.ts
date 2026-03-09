import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageLearningObject } from '../../../model/learning-object.model';
import { ImageDialogComponent } from './image-dialog.component';

@Component({
  selector: 'cc-image-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="image-wrapper">
      <img [src]="item().url" [alt]="item().caption" (click)="openDialog()" />
    </div>
    @if (item().caption) {
      <p class="caption">{{ item().caption }}</p>
    }
  `,
  styles: `
    .image-wrapper { text-align: center; }
    img { max-width: 100%; cursor: pointer; }
    .caption { text-align: center; font-style: italic; margin-top: 8px; }
  `,
})
export class ImageItemComponent {
  private readonly dialog = inject(MatDialog);
  readonly item = input.required<ImageLearningObject>();

  openDialog(): void {
    this.dialog.open(ImageDialogComponent, {
      data: { url: this.item().url },
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
}
