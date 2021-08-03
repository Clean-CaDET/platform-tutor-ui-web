import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cc-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent {

  url: string;

  constructor(@Inject(MAT_DIALOG_DATA) data, private dialogRef: MatDialogRef<ImageDialogComponent>) {
    this.url = data.url;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
