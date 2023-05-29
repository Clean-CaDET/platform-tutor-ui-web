import { Component, Input, OnChanges } from '@angular/core';
import { Learner } from 'src/app/modules/monitoring/model/learner.model';
import { Unit } from 'src/app/modules/learning/model/unit.model';
import { LearnerEnrollment } from '../../model/learner-enrollment.model';
import { EnrollmentService } from './enrollment.service';

@Component({
  selector: 'cc-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnChanges {
  @Input() learners: Learner[];
  @Input() unit: Unit;

  enrollments: LearnerEnrollment[] = [];

  progressBarActive = false;
  isAnyUnenrolled: boolean;

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnChanges(): void {
    this.enrollments = [];
    if(this.unit?.id) {
      this.getEnrollments();
    }
  }
  
  private getEnrollments(): void {
    this.progressBarActive = true;
    this.enrollmentService.getEnrollments(this.unit.id, this.learners.map(l => l.id))
      .subscribe(unitEnrollments => {
        this.learners.forEach(learner => {
          let enrollment = unitEnrollments.find(e => e.learnerId === learner.id);
          this.enrollments.push({
            learner,
            enrollment
          });
        });
        this.progressBarActive = false;
        this.updateAnyUnenrolled();
      });
  }

  private updateAnyUnenrolled() {
    this.isAnyUnenrolled = this.enrollments.some(this.isUnenrolled);
  }

  private isUnenrolled(e: LearnerEnrollment): boolean {
    return !e.enrollment || e.enrollment.status === "Hidden";
  }

  enrollAll(): void {
    this.progressBarActive = true;
    this.enrollmentService.bulkEnroll(this.unit.id, this.enrollments.filter(this.isUnenrolled).map(e => e.learner.id))
      .subscribe(newEnrollments => {
        newEnrollments.forEach(newEnrollment => {
          let enrollment = this.enrollments.find(e => e.learner.id === newEnrollment.learnerId);
          enrollment.enrollment = newEnrollment;
        });
        this.updateAnyUnenrolled();
        this.progressBarActive = false;
      });
  }

  enroll(learnerId: number): void {
    this.enrollmentService.enroll(this.unit.id, learnerId)
      .subscribe(newEnrollment => {
        let enrollment = this.enrollments.find(e => e.learner.id === newEnrollment.learnerId);
        enrollment.enrollment = newEnrollment;
        this.updateAnyUnenrolled();
      });
  }

  unenroll(learnerId: number): void {
    this.enrollmentService.unenroll(this.unit.id, learnerId)
      .subscribe(() => {
      let enrollment = this.enrollments.find(e => e.learner.id === learnerId);
      enrollment.enrollment = null;
      this.updateAnyUnenrolled();
    });
  }
}
