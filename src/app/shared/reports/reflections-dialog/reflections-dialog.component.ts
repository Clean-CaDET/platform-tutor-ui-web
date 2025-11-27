import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UnitReport } from '../course-report.model';

@Component({
  selector: 'cc-reflections-dialog',
  templateUrl: './reflections-dialog.component.html',
  styleUrl: './reflections-dialog.component.scss'
})
export class ReflectionsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public unit: UnitReport,
    private dialogRef: MatDialogRef<ReflectionsDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
