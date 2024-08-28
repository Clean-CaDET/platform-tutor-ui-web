import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Learner } from '../model/learner.model';
import { Unit } from '../model/unit.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GradingService } from '../grading/grading.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'cc-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  @Input() courseId: number;
  @Input() selectedLearnerId: number;
  @Input() learners: Learner[];
  @Output() learnerChanged = new EventEmitter<number>();
  selectedUnitId = 0;
  selectedDate: Date;

  units: Unit[] = [];
  
  feedbackForm: FormGroup;

  // TODO: Consider migrating common methods of GradingService to MonitoringService
  constructor(private gradingService: GradingService, private builder: FormBuilder) { }

  ngOnInit() {
    this.selectedDate = new Date("7/1/2024");
    this.getUnits();
  }

  ngOnChanges() {
    if (this.selectedUnitId) {
      // TODO: Get statistics
    }
  }

  private getUnits() {
    this.gradingService.getUnits(this.courseId, this.selectedLearnerId, this.selectedDate).subscribe(units =>
        this.units = units.sort((a, b) => a.order - b.order));
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    this.selectedUnitId = 0;
    this.getUnits();
  }
}