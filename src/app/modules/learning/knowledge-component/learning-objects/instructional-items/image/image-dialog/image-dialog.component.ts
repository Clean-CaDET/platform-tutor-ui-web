import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'cc-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css'],
})
export class ImageDialogComponent {
  url: string;
  zoomedIn = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { url: string },
    private dialogRef: MatDialogRef<ImageDialogComponent>
  ) {
    this.url = data.url;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
