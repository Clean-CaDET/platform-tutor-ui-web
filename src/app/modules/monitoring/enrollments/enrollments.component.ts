import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input() learners: Learner[];
  @Input() courseId: number;

  units: Unit[];
  progressBarActive = false;
  selectedDate: Date = new Date();

  constructor(private enrollmentsService: EnrollmentsService, private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.courseId && changes.courseId.currentValue !== changes.courseId.previousValue) {
      this.getCourse();
    } else {
      this.getEnrollments();
    }
  }

  private getCourse(): void {
    this.progressBarActive = true;
    this.enrollmentsService.getUnits(this.courseId).subscribe(course => {
      this.units = course.knowledgeUnits.sort((a, b) => a.order - b.order);
      this.getEnrollments();
    });
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
    if(unitEnrollments.length < this.learners.length || unitEnrollments.some(e => e.status !== 'Active' && e.status !== 'Completed')) {
      const firstActive = unitEnrollments.find(e => e.status === 'Active' ||  e.status === 'Completed');
      if(firstActive) return { status: 'InactiveSome', availableFrom: firstActive.availableFrom, bestBefore: firstActive.bestBefore };
      return { status: "InactiveAll", availableFrom: unitEnrollments[0].availableFrom, bestBefore: unitEnrollments[0].bestBefore};
    }
    return unitEnrollments[0];
  }

  startEnrollment(unit: Unit): void {
    const availableFromField: Field = { code: 'availableFrom', type: 'date', label: 'Pristup od', required: true };
    const bestBeforeField: Field = { code: 'bestBefore', type: 'date', label: 'Najbolje rešiti do', required: true };

    const startingDates = {
      availableFrom: unit.groupEnrollment.availableFrom || this.selectedDate,
      bestBefore: unit.groupEnrollment.bestBefore || this.selectedDate
    }

    const dialogRef = this.dialog.open(GenericFormComponent, {
      data: {
        entity: startingDates,
        fieldConfiguration: new Array(availableFromField, bestBeforeField),
        label: "**Upozorenje**: Aktiviranjem pristupa se ograničava dalja izmena lekcije:\n\n- Nove KZ i pitanja neće biti dostupna studentima koji su bar jednom dobili pristup lekciji,\n- Postojeći materijali se mogu izmeniti (npr. za ispravku pravopisa, pogrešne opcije u pitanju).\n- Brisanje postojećih materijala će izazvati greške kod studenata koji su bar jednom dobili pristup.\n\nZbog navedenog, svo autorstvo van sitnih korekcija treba raditi pre početka lekcije."},
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
