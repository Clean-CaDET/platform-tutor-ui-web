import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'cc-image-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule, MatDialogClose],
  template: `
    <div class="dialog-wrapper">
      <button matIconButton mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
      <img [src]="url" [class]="zoomedIn() ? 'zoomed-in' : 'zoomed-out'" (click)="zoomedIn.set(!zoomedIn())" />
    </div>
  `,
  styles: `
    .dialog-wrapper { position: relative; }
    .close-button { position: absolute; top: 4px; right: 4px; z-index: 1; }
    img { cursor: pointer; display: block; }
    .zoomed-out { max-width: 100%; max-height: 80vh; }
    .zoomed-in { max-width: none; max-height: none; }
  `,
})
export class ImageDialogComponent {
  private readonly data = inject<{ url: string }>(MAT_DIALOG_DATA);
  readonly url = this.data.url;
  readonly zoomedIn = signal(false);
}
