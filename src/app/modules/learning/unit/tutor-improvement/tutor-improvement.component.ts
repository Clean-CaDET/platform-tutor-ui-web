import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ImprovementService } from './improvement.service';

@Component({
  selector: 'cc-tutor-improvement',
  templateUrl: './tutor-improvement.component.html',
  styleUrls: ['./tutor-improvement.component.scss'],
})
export class TutorImprovementComponent {
  improvementForm = new FormGroup({
    tutorImprovement: new FormControl('', [
      Validators.required,
      this.improvementValidator(),
    ]),
    educationalContentImprovement: new FormControl('', [
      Validators.required,
      this.improvementValidator(),
    ]),
  });

  constructor(
    private improvementService: ImprovementService,
    private dialogRef: MatDialogRef<TutorImprovementComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { unitId: number }
  ) {}

  onSubmit(): void {
    this.improvementService.submitImprovement(
      this.data.unitId,
      this.improvementForm
    );
    this.dialogRef.close();
  }

  improvementValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = control.value.length > 10;
      return valid ? null : { shortText: { value: control.value } };
    };
  }
}
