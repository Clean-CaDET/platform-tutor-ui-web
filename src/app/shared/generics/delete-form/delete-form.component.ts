import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cc-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.scss']
})
export class DeleteFormComponent {
  secureDelete: boolean;
  confirmationCode: string;
  userCode: string;

  constructor(private dialogRef: MatDialogRef<DeleteFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.secureDelete = data?.secureDelete;
    if(this.secureDelete) {
      this.generateCode();
    }
  }
  
  private generateCode() {
    const chars = 'abcdefghijkmn123456789';
    this.confirmationCode = '';
    for (let i = 0; i < 2; i++) {
      this.confirmationCode += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  onClose(accept: boolean): void {
    this.dialogRef.close(accept);
  }
}
