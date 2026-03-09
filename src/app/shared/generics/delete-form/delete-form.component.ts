import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'cc-delete-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatDialogContent, MatDialogActions, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-dialog-content>
      <p>Da li ste sigurni da želite da obrišete označenu stavku?</p>
      @if (secureDelete) {
        <div class="flex-col" style="align-items: center;">
          <span>Unesite sledeće karaktere pre potvrde brisanja</span>
          <h2 style="user-select: none;">{{ confirmationCode }}</h2>
          <mat-form-field appearance="outline">
            <input matInput [(ngModel)]="userCode" [maxlength]="confirmationCode.length" style="text-align: center;" />
          </mat-form-field>
        </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="center" class="flex-row gap">
      <button matButton="filled" (click)="onClose(true)"
        [disabled]="secureDelete && userCode !== confirmationCode">Potvrdi</button>
      <button matButton (click)="onClose(false)">Odustani</button>
    </mat-dialog-actions>
  `,
})
export class DeleteFormComponent {
  private readonly dialogRef = inject(MatDialogRef<DeleteFormComponent>);
  private readonly data = inject<{ secureDelete?: boolean }>(MAT_DIALOG_DATA);

  secureDelete: boolean;
  confirmationCode = '';
  userCode = '';

  constructor() {
    this.secureDelete = this.data?.secureDelete ?? false;
    if (this.secureDelete) {
      this.generateCode();
    }
  }

  private generateCode(): void {
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
