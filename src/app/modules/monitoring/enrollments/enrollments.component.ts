import { Component, Input, OnChanges } from '@angular/core';
import { Unit } from '../model/unit.model';
import { Learner } from '../model/learner.model';
import { MatDialog } from '@angular/material/dialog';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment } from '../model/enrollment.model';
import { Field } from 'src/app/shared/generics/model/field.model';
import { GenericFormComponent } from 'src/app/shared/generics/generic-form/generic-form.component';

@Component({
  selector: 'cc-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss']
})
export class EnrollmentsComponent implements OnChanges {
  progressBarActive = false;

  @Input() learners: Learner[];
  @Input() units: Unit[];

  constructor(private enrollmentsService: EnrollmentsService, private dialog: MatDialog) { }

  ngOnChanges(): void {
    this.getEnrollments();
  }

  private getEnrollments(): void {
    this.progressBarActive = true;
    this.enrollmentsService.get(this.units.map(u => u.id), this.learners.map(l => l.id))
      .subscribe(enrollments => {
        this.progressBarActive = false;
        this.units.forEach(u => {
          u.enrollments = enrollments.filter(e => e.knowledgeUnitId === u.id);
          u.groupEnrollment = this.aggregateGroupEnrollment(u.enrollments);
        });
      });
  }

  private aggregateGroupEnrollment(unitEnrollments: Enrollment[]): Enrollment {
    if(!unitEnrollments.length) return { status: "InactiveAll"};
    if(unitEnrollments.length < this.learners.length || unitEnrollments.some(e => e.status !== 'Active')) {
      const firstActive = unitEnrollments.find(e => e.status === 'Active');
      if(firstActive) return { status: 'InactiveSome', availableFrom: firstActive.availableFrom, bestBefore: firstActive.bestBefore };
      return { status: "InactiveAll", availableFrom: unitEnrollments[0].availableFrom, bestBefore: unitEnrollments[0].bestBefore};
    }
    return unitEnrollments[0];
  }

  startEnrollment(unit: Unit): void {
    const availableFromField: Field = { code: 'availableFrom', type: 'date', label: 'Pristup od', required: true };
    const bestBeforeField: Field = { code: 'bestBefore', type: 'date', label: 'Najbolje rešiti do', required: true };

    const dialogRef = this.dialog.open(GenericFormComponent, {
      data: {entity: unit.groupEnrollment, fieldConfiguration: new Array(availableFromField, bestBeforeField)},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      else this.groupEnroll(unit, result);
    });
  }

  private groupEnroll(unit: Unit, enrollment: Enrollment): void {
    this.progressBarActive = true;
    this.enrollmentsService.bulkEnroll(unit.id, this.learners.map(l => l.id), enrollment)
      .subscribe(newEnrollments => {
        unit.enrollments = newEnrollments;
        unit.groupEnrollment = this.aggregateGroupEnrollment(unit.enrollments);
        this.progressBarActive = false;
      });
  }

  groupUnenroll(unit: Unit): void {
    this.progressBarActive = true;
    this.enrollmentsService.bulkUnenroll(unit.id, this.learners.map(l => l.id))
      .subscribe(newEnrollments => {
        unit.enrollments = newEnrollments;
        unit.groupEnrollment = this.aggregateGroupEnrollment(unit.enrollments);
        this.progressBarActive = false;
      });
  }
}
