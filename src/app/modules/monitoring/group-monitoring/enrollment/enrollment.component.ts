import { Component, Input, OnChanges } from '@angular/core';
import { Learner } from 'src/app/modules/knowledge-analytics/model/learner.model';
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
    if(this.unit?.id) {
      this.getEnrollments();
    }
  }
  
  private getEnrollments(): void {
    this.progressBarActive = true;
    this.enrollmentService.getEnrollments(this.unit.id, this.learners.map(l => l.id))
      .subscribe(unitEnrollments => {
        this.enrollments = [];
        this.learners.forEach(learner => {
          let enrollment = unitEnrollments.find(e => e.learnerId === learner.id);
          this.enrollments.push({
            learner,
            enrollment
          });
        });
        this.progressBarActive = false;
        this.isAnyUnenrolled = this.enrollments.some(e => !e.enrollment);
      });
  }

  enrollAll(): void {
    this.progressBarActive = true;
    this.enrollmentService.bulkEnroll(this.unit.id, this.enrollments.filter(e => !e.enrollment).map(e => e.learner.id))
      .subscribe(newEnrollments => {
        newEnrollments.forEach(newEnrollment => {
          let enrollment = this.enrollments.find(e => e.learner.id === newEnrollment.learnerId);
          enrollment.enrollment = newEnrollment;
        });
        this.isAnyUnenrolled = this.enrollments.some(e => !e.enrollment);
        this.progressBarActive = false;
      });
  }

  enroll(learnerId: number): void {
    this.enrollmentService.enroll(this.unit.id, learnerId)
      .subscribe(newEnrollment => {
        let enrollment = this.enrollments.find(e => e.learner.id === newEnrollment.learnerId);
        enrollment.enrollment = newEnrollment;
        this.isAnyUnenrolled = this.enrollments.some(e => !e.enrollment);
      });
  }

  unenroll(learnerId: number): void {
    this.enrollmentService.unenroll(this.unit.id, learnerId)
      .subscribe(() => {
      let enrollment = this.enrollments.find(e => e.learner.id === learnerId);
      enrollment.enrollment = null;
      this.isAnyUnenrolled = this.enrollments.some(e => !e.enrollment);
    });
  }
}
