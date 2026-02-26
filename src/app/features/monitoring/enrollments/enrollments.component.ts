import { Component, ChangeDetectionStrategy, inject, input, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
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

  readonly units = signal<MonitoringUnit[]>([]);
  readonly progressBarActive = signal(false);
  readonly selectedDate = signal(new Date());

  constructor() {
    effect(() => {
      const courseId = this.courseId();
      if (courseId) this.getCourse();
    });
  }

  private getCourse(): void {
    this.progressBarActive.set(true);
    this.enrollmentsService.getUnits(this.courseId()).subscribe({
      next: course => {
        this.units.set((course.knowledgeUnits ?? []).sort((a, b) => a.order - b.order));
        this.getEnrollments();
      },
      error: () => this.progressBarActive.set(false),
    });
  }

  private getEnrollments(): void {
    this.progressBarActive.set(true);
    this.enrollmentsService.get(this.units().map(u => u.id), this.learners().map(l => l.id))
      .subscribe({
        next: enrollments => {
          this.progressBarActive.set(false);
          const updated = this.units().map(u => {
            const unitEnrollments = enrollments.filter(e => e.knowledgeUnitId === u.id);
            return { ...u, enrollments: unitEnrollments, groupEnrollment: this.aggregateGroupEnrollment(unitEnrollments) };
          });
          this.units.set(updated);
        },
        error: () => this.progressBarActive.set(false),
      });
  }

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
    this.progressBarActive.set(true);
    this.enrollmentsService.bulkEnroll(unit.id, this.learners().map(l => l.id), enrollment)
      .subscribe({
        next: newEnrollments => {
          const updated = this.units().map(u => {
            if (u.id !== unit.id) return u;
            return { ...u, enrollments: newEnrollments, groupEnrollment: this.aggregateGroupEnrollment(newEnrollments) };
          });
          this.units.set(updated);
          this.progressBarActive.set(false);
        },
        error: () => this.progressBarActive.set(false),
      });
  }

  groupUnenroll(unit: MonitoringUnit): void {
    this.progressBarActive.set(true);
    this.enrollmentsService.bulkUnenroll(unit.id, this.learners().map(l => l.id))
      .subscribe({
        next: newEnrollments => {
          const updated = this.units().map(u => {
            if (u.id !== unit.id) return u;
            return { ...u, enrollments: newEnrollments, groupEnrollment: this.aggregateGroupEnrollment(newEnrollments) };
          });
          this.units.set(updated);
          this.progressBarActive.set(false);
        },
        error: () => this.progressBarActive.set(false),
      });
  }
}
