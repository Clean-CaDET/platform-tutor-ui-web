import {Component, Inject} from '@angular/core';
import {UnitProgressRating} from "../../model/unit-progress-rating.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UnitProgressRatingService } from './unit-progress-rating.service';
import { trigger, state, animate, style, transition } from '@angular/animations';

@Component({
  selector: 'cc-unit-progress-rating',
  templateUrl: './unit-progress-rating.component.html',
  styleUrls: ['./unit-progress-rating.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [animate('0.4s ease-in')])
    ])
  ]
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

  isProcessing: boolean;
  endMessage: string;
  endProgress: number;
  endInterval: any;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private dialogRef: MatDialogRef<UnitProgressRatingComponent>,
    private builder: FormBuilder, private service: UnitProgressRatingService) {
    this.initializeFields(data);
    this.createForm();
  }

  private initializeFields(data: any) {
    this.unitId = data.unitId;
    this.completedKcIds = data.completedKcIds;
    this.completedTaskIds = data.completedTaskIds;
    this.flags.isLearnerInitiated = data.isLearnerInitiated;
    this.flags.kcFeedback = data.kcFeedback;
    this.flags.taskFeedback = data.taskFeedback;
  }

  private createForm() {
    this.options = {
      learnerProgress: ['Nikakav', 'Slab', 'Korektan', 'Jak'],
      instructionClarity: ['Nimalo', 'Slabo', 'Korektno', 'Veoma'],
      assessmentClarity: ['Nimalo', 'Slabo', 'Korektno', 'Veoma'],
      taskChallenge: ['Teški su', 'Taman', 'Laki su']
    };
    this.ratingForm = this.builder.group({
      comment: new FormControl('')
    });
    if (!this.flags.isLearnerInitiated) this.ratingForm.addControl('learnerProgress', new FormControl(3));
    if (this.flags.kcFeedback) this.ratingForm.addControl('instructionClarity', new FormControl(3));
    if (this.flags.kcFeedback) this.ratingForm.addControl('assessmentClarity', new FormControl(3));
    if (this.flags.taskFeedback) this.ratingForm.addControl('taskChallenge', new FormControl(0));
  }

  submit() {
    this.isProcessing = true;
    const rating: UnitProgressRating = {
      knowledgeUnitId: this.unitId,
      completedKcIds: this.completedKcIds,
      completedTaskIds: this.completedTaskIds,
      feedback: JSON.stringify(this.ratingForm.value),
      isLearnerInitiated: this.flags.isLearnerInitiated
    };
    this.service.rate(rating).subscribe({
      next: _ => {
        this.processEnd("🤗 Hvala na povratnoj informaciji! Pametnije ćemo raditi na unapređenju.");
      },
      error: _ => {
        this.processEnd("😟 Nažalost, nismo uspeli da zabeležimo povratnu informaciju. Drugi put!");
      }
    });
  }

  processEnd(message: string) {
    this.endMessage = message;
    this.endProgress = 0;

    const step = 3.5;

    this.endInterval = setInterval(() => {
      this.endProgress += step;
      if (this.endProgress > 110) {
        this.close();
      }
    }, 100);
  }

  close() {
    if(this.endInterval) clearInterval(this.endInterval);
    this.dialogRef.close();
  }
}
