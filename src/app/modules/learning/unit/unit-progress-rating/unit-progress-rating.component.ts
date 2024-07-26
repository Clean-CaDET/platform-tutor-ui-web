import {Component, Inject} from '@angular/core';
import {UnitProgressRating} from "../../model/unit-progress-rating.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {KcRateService as UnitProgressRatingService} from "./unit-progress-rating.service";
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

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private dialogRef: MatDialogRef<UnitProgressRatingComponent>,
    private ratingService : UnitProgressRatingService, private builder: FormBuilder) {
    this.unitId = data.unitId;
    this.completedKcIds = data.completedKcIds;
    this.completedTaskIds = data.completedTaskIds;

    this.options = {
      learnerProgress: ['Slab', 'Umeren', 'Jak'],
      instructionClarity: ['Nije', 'Ok', 'Veoma'],
      assessmentClarity: ['Nisu', 'Ok', 'Veoma'],
      taskChallenge: ['Teški su', 'Taman', 'Laki su']
    };
    
    this.ratingForm = this.builder.group({      
      learnerProgress: new FormControl('0'),
      instructionClarity: new FormControl('0'),
      assessmentClarity: new FormControl('0'),
      taskChallenge: new FormControl('0'),
      comment: new FormControl('')
    });
  }

  closeDialog() {
    const rating: UnitProgressRating = {
      unitId: this.unitId,
      completedKcIds: this.completedKcIds,
      completedTaskIds: this.completedTaskIds,
      feedback: JSON.stringify(this.ratingForm.value)
    };
    this.ratingService.rate(rating).subscribe(_ => {
      this.dialogRef.close();
    });
  }
}
