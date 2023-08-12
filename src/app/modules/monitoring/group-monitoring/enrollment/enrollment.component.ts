import { Component, Input, OnChanges } from '@angular/core';
import { Learner } from 'src/app/modules/monitoring/model/learner.model';
import { Unit } from 'src/app/modules/learning/model/unit.model';
import { LearnerEnrollment } from '../../model/learner-enrollment.model';
import { EnrollmentService } from './enrollment.service';
import { MatDialog } from '@angular/material/dialog';
import { GenericFormComponent } from 'src/app/shared/generics/generic-form/generic-form.component';
import { Field } from 'src/app/shared/generics/model/field.model';

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
  isAnyEnrolled: boolean;

  constructor(private enrollmentService: EnrollmentService, private dialog: MatDialog) {}

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
        this.updateEnrollmentFlags();
      });
  }

  private updateEnrollmentFlags() {
    this.isAnyUnenrolled = this.enrollments.some(this.isUnenrolled);
    this.isAnyEnrolled = this.enrollments.some(e => !this.isUnenrolled(e));
  }

  private isUnenrolled(e: LearnerEnrollment): boolean {
    return !e.enrollment || e.enrollment.status === "Deactivated";
  }

  enrollAll(startDate: Date): void {
    this.progressBarActive = true;
    this.enrollmentService.bulkEnroll(this.unit.id, this.enrollments.filter(this.isUnenrolled).map(e => e.learner.id), startDate)
      .subscribe(newEnrollments => {
        newEnrollments.forEach(newEnrollment => {
          let enrollment = this.enrollments.find(e => e.learner.id === newEnrollment.learnerId);
          enrollment.enrollment = newEnrollment;
        });
        this.updateEnrollmentFlags();
        this.progressBarActive = false;
      });
  }

  enroll(learnerId: number, startDate: Date): void {
    this.enrollmentService.enroll(this.unit.id, learnerId, startDate)
      .subscribe(newEnrollment => {
        let enrollment = this.enrollments.find(e => e.learner.id === newEnrollment.learnerId);
        enrollment.enrollment = newEnrollment;
        this.updateEnrollmentFlags();
      });
  }

  unenroll(learnerId: number): void {
    this.enrollmentService.unenroll(this.unit.id, learnerId).subscribe(() => {
      let enrollment = this.enrollments.find(e => e.learner.id === learnerId);
      enrollment.enrollment = null;
      this.updateEnrollmentFlags();
    });
  }

  unenrollAll(): void {
    this.progressBarActive = true;
    this.enrollmentService.bulkUnenroll(this.unit.id, this.enrollments.filter(e => !this.isUnenrolled(e)).map(e => e.learner.id))
      .subscribe(newEnrollments => {
        newEnrollments.forEach(newEnrollment => {
          let enrollment = this.enrollments.find(e => e.learner.id === newEnrollment.learnerId);
          enrollment.enrollment = newEnrollment;
        });
        this.updateEnrollmentFlags();
        this.progressBarActive = false;
      });
  }

  startEnrollment(learnerId: number): void {
    let dateField: Field = { code: 'startDate', type: 'date', label: 'Početak pristupa', required: true };

    const dialogRef = this.dialog.open(GenericFormComponent, {
      data: {entity: { startDate: this.findStartDate() }, fieldConfiguration: new Array(dateField)},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;

      if(learnerId) this.enroll(learnerId, result.startDate);
      else this.enrollAll(result.startDate);
    });
  }

  findStartDate(): Date {
    for(let i = 0; i < this.enrollments.length; i++) {
      let enrollment = this.enrollments[i].enrollment;

      if(enrollment && enrollment.status === "Active") return enrollment.start;
    }

    return null;
  }
}
