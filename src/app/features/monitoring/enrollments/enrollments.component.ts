import { Component, ChangeDetectionStrategy, inject, input, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MonitoringUnit } from '../model/unit.model';
import { Learner } from '../model/learner.model';
import { Enrollment } from '../model/enrollment.model';
import { EnrollmentsService } from './enrollments.service';
import { Field } from '../../../shared/generics/model/field.model';
import { GenericFormComponent } from '../../../shared/generics/generic-form/generic-form.component';

@Component({
  selector: 'cc-enrollments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe, MatIconModule, MatButtonModule, MatDividerModule,
    MatTooltipModule, MatProgressBarModule, MatDatepickerModule,
  ],
  templateUrl: './enrollments.component.html',
  styleUrl: './enrollments.component.scss',
})
export class EnrollmentsComponent {
  private readonly enrollmentsService = inject(EnrollmentsService);
  private readonly dialog = inject(MatDialog);

  readonly courseId = input.required<number>();
  readonly learners = input.required<Learner[]>();

  readonly selectedDate = signal(new Date());

  private readonly unitsResource = rxResource({
    params: () => ({ courseId: this.courseId() }),
    stream: ({ params }) => this.enrollmentsService.getUnits(params.courseId).pipe(
      map(course => (course.knowledgeUnits ?? []).sort((a, b) => a.order - b.order))
    ),
    defaultValue: [],
  });

  private readonly enrollmentsResource = rxResource({
    params: () => {
      const unitIds = this.unitsResource.value().map(u => u.id);
      const learnerIds = this.learners().map(l => l.id);
      if (!unitIds.length || !learnerIds.length) return undefined;
      return { unitIds, learnerIds };
    },
    stream: ({ params }) => this.enrollmentsService.get(params.unitIds, params.learnerIds),
    defaultValue: [],
  });

  readonly units = computed(() => {
    const rawUnits = this.unitsResource.value();
    const enrollments = this.enrollmentsResource.value();
    return rawUnits.map(u => {
      const unitEnrollments = enrollments.filter(e => e.knowledgeUnitId === u.id);
      return { ...u, enrollments: unitEnrollments, groupEnrollment: this.aggregateGroupEnrollment(unitEnrollments) };
    });
  });

  readonly progressBarActive = computed(() => this.unitsResource.isLoading() || this.enrollmentsResource.isLoading());

  private aggregateGroupEnrollment(unitEnrollments: Enrollment[]): Enrollment {
    if (!unitEnrollments.length) return { status: 'InactiveAll' };
    if (unitEnrollments.length < this.learners().length || unitEnrollments.some(e => e.status !== 'Active' && e.status !== 'Completed')) {
      const firstActive = unitEnrollments.find(e => e.status === 'Active' || e.status === 'Completed');
      if (firstActive) return { status: 'InactiveSome', availableFrom: firstActive.availableFrom, bestBefore: firstActive.bestBefore };
      return { status: 'InactiveAll', availableFrom: unitEnrollments[0].availableFrom, bestBefore: unitEnrollments[0].bestBefore };
    }
    return unitEnrollments[0];
  }

  startEnrollment(unit: MonitoringUnit): void {
    const availableFromField: Field = { code: 'availableFrom', type: 'date', label: 'Pristup od', required: true };
    const bestBeforeField: Field = { code: 'bestBefore', type: 'date', label: 'Najbolje rešiti do', required: true };

    const startingDates = {
      availableFrom: unit.groupEnrollment.availableFrom || this.selectedDate(),
      bestBefore: unit.groupEnrollment.bestBefore || this.selectedDate(),
    };

    const dialogRef = this.dialog.open(GenericFormComponent, {
      minWidth: "720px",
      data: {
        entity: startingDates,
        fieldConfiguration: [availableFromField, bestBeforeField],
        label: '**Upozorenje**: Aktiviranjem pristupa se ograničava dalja izmena lekcije:\n\n- Nove KZ i pitanja neće biti dostupna studentima koji su bar jednom dobili pristup lekciji,\n- Postojeći materijali se mogu izmeniti (npr. za ispravku pravopisa, pogrešne opcije u pitanju).\n- Brisanje postojećih materijala će izazvati greške kod studenata koji su bar jednom dobili pristup.\n\nZbog navedenog, svo autorstvo van sitnih korekcija treba raditi pre početka lekcije.',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.groupEnroll(unit, result);
    });
  }

  private groupEnroll(unit: MonitoringUnit, enrollment: Enrollment): void {
    this.enrollmentsService.bulkEnroll(unit.id, this.learners().map(l => l.id), enrollment)
      .subscribe(newEnrollments => this.enrollmentsResource.value.update(
        current => [...current.filter(e => e.knowledgeUnitId !== unit.id), ...newEnrollments]
      ));
  }

  groupUnenroll(unit: MonitoringUnit): void {
    this.enrollmentsService.bulkUnenroll(unit.id, this.learners().map(l => l.id))
      .subscribe(newEnrollments => this.enrollmentsResource.value.update(
        current => [...current.filter(e => e.knowledgeUnitId !== unit.id), ...newEnrollments]
      ));
  }
}
