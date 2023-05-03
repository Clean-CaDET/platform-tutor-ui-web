import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

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
