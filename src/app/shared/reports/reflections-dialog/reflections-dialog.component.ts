import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CcMarkdownComponent } from '../../markdown/cc-markdown.component';
import { UnitReport } from '../course-report.model';

@Component({
  selector: 'cc-reflections-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, CcMarkdownComponent],
  templateUrl: './reflections-dialog.component.html',
  styleUrl: './reflections-dialog.component.scss',
})
export class ReflectionsDialogComponent {
  readonly unit = inject<UnitReport>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ReflectionsDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
