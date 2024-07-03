import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImprovementService } from './improvement.service';

@Component({
  selector: 'cc-tutor-improvement',
  templateUrl: './tutor-improvement.component.html',
  styleUrls: ['./tutor-improvement.component.scss'],
})
export class TutorImprovementComponent {
  improvementForm = new FormGroup({
    tutorImprovement: new FormControl(''),
    educationalContentImprovement: new FormControl('', Validators.required),
  });

  constructor(
    private improvementService: ImprovementService,
    private dialogRef: MatDialogRef<TutorImprovementComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { unitId: number }
  ) {}

  onSubmit(): void {
    const tutorFeedback = this.improvementForm.value.tutorImprovement;
    const unitFeedback = this.improvementForm.value.educationalContentImprovement;
    this.improvementService.submitImprovement(this.data.unitId, tutorFeedback, unitFeedback);
    this.dialogRef.close();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
