import {Component, Inject} from '@angular/core';
import {UnitProgressRating} from "../../model/unit-progress-rating.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'cc-unit-progress-rating',
  templateUrl: './unit-progress-rating.component.html',
  styleUrls: ['./unit-progress-rating.component.scss']
})
export class UnitProgressRatingComponent {
  unitId: number;
  completedKcIds: number[];
  completedTaskIds: number[];
  ratingForm: FormGroup;
  options: any;
  flags = {
    isLearnerInitiated: false,
    kcFeedback: false,
    taskFeedback: false
  }

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private dialogRef: MatDialogRef<UnitProgressRatingComponent>,
    private builder: FormBuilder) {
    this.unitId = data.unitId;
    this.completedKcIds = data.completedKcIds;
    this.completedTaskIds = data.completedTaskIds;
    this.flags.isLearnerInitiated = data.isLearnerInitiated;
    this.flags.kcFeedback = data.kcFeedback;
    this.flags.taskFeedback = data.taskFeedback;

    this.options = {
      learnerProgress: ['Slab', 'Umeren', 'Jak'],
      instructionClarity: ['Nije', 'Ok', 'Veoma'],
      assessmentClarity: ['Nisu', 'Ok', 'Veoma'],
      taskChallenge: ['Teški su', 'Taman', 'Laki su']
    };
    
    this.ratingForm = this.builder.group({      
      comment: new FormControl('')
    });
    if(!this.flags.isLearnerInitiated) this.ratingForm.addControl('learnerProgress', new FormControl('0'));
    if(this.flags.kcFeedback) this.ratingForm.addControl('instructionClarity', new FormControl('0'));
    if(this.flags.kcFeedback) this.ratingForm.addControl('assessmentClarity', new FormControl('0'));
    if(this.flags.taskFeedback) this.ratingForm.addControl('taskChallenge', new FormControl('0'));
  }

  submit() {
    const rating: UnitProgressRating = {
      knowledgeUnitId: this.unitId,
      completedKcIds: this.completedKcIds,
      completedTaskIds: this.completedTaskIds,
      feedback: JSON.stringify(this.ratingForm.value),
      isLearnerInitiated: this.flags.isLearnerInitiated
    };
    this.dialogRef.close(rating);
  }

  close() {
    this.dialogRef.close();
  }
}
