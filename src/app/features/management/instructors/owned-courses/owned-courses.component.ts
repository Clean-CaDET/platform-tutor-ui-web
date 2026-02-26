import { Component, ChangeDetectionStrategy, inject, input, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenericSelectionFormComponent } from '../../../../shared/generics/generic-selection-form/generic-selection-form.component';
import { deleteWithConfirmation } from '../../../../shared/generics/delete-form/delete-with-confirmation.util';
import { InstructorsService } from '../instructors.service';
import { StakeholderAccount } from '../../model/stakeholder-account.model';
import { Course } from '../../../../shared/model/course.model';

@Component({
  selector: 'cc-owned-courses',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './owned-courses.component.html',
})
export class OwnedCoursesComponent {
  private readonly instructorService = inject(InstructorsService);
  private readonly dialog = inject(MatDialog);

  readonly instructor = input.required<StakeholderAccount>();
  readonly allCourses = input.required<Course[]>();
  readonly columns = ['code', 'name', 'CRUD'];

  private readonly ownedCoursesResource = rxResource({
    params: () => this.instructor(),
    stream: ({ params: instructor }) => this.instructorService.getOwnedCourses(instructor.id),
    defaultValue: [],
  });

  readonly data = linkedSignal(() => this.ownedCoursesResource.value());

  onAddOwnedCourse(): void {
    const dialogRef = this.dialog.open(GenericSelectionFormComponent, {
      data: {
        items: this.findNotOwnedCourses(),
        presentationFunction: (course: Course) => course.code + ', ' + course.name,
        label: 'Modul',
      },
    });

    dialogRef.afterClosed().subscribe((course: Course) => {
      if (!course) return;
      this.instructorService.addOwnedCourse(this.instructor().id, course.id!).subscribe(response => {
        this.data.update(d => [...d, response]);
      });
    });
  }

  onDelete(courseId: number): void {
    deleteWithConfirmation(
      this.dialog,
      () => this.instructorService.removeOwnedCourse(this.instructor().id, courseId),
      this.data,
      courseId,
    );
  }

  private findNotOwnedCourses(): Course[] {
    return this.allCourses().filter(c => !this.data().find(o => o.id === c.id));
  }
}
