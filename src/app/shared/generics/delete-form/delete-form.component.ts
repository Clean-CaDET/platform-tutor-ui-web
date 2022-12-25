import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cc-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.scss']
})
export class DeleteFormComponent {

  constructor(private dialogRef: MatDialogRef<DeleteFormComponent>) {}

  onClose(accept: boolean): void {
    this.dialogRef.close(accept);
  }
}
