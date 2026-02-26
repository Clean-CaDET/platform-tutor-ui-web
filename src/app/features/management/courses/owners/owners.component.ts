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
import { ManagementCoursesService } from '../management-courses.service';
import { StakeholderAccount } from '../../model/stakeholder-account.model';
import { Course } from '../../../../shared/model/course.model';

@Component({
  selector: 'cc-owners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './owners.component.html',
})
export class OwnersComponent {
  private readonly ownersService = inject(ManagementCoursesService);
  private readonly dialog = inject(MatDialog);

  readonly course = input.required<Course>();
  readonly allInstructors = input.required<StakeholderAccount[]>();
  readonly columns = ['name', 'surname', 'CRUD'];

  private readonly ownersResource = rxResource({
    params: () => this.course(),
    stream: ({ params: course }) => this.ownersService.getOwners(course.id!),
    defaultValue: [],
  });

  readonly data = linkedSignal(() => this.ownersResource.value());

  onAddOwner(): void {
    const dialogRef = this.dialog.open(GenericSelectionFormComponent, {
      data: {
        items: this.findNotOwners(),
        presentationFunction: (instructor: StakeholderAccount) => instructor.email + ', ' + instructor.name + ', ' + instructor.surname,
        label: 'Mentor',
      },
    });

    dialogRef.afterClosed().subscribe((instructor: StakeholderAccount) => {
      if (!instructor) return;
      this.ownersService.addOwner(this.course().id!, instructor.id).subscribe(() => {
        this.data.update(d => [...d, instructor]);
      });
    });
  }

  onDelete(instructorId: number): void {
    deleteWithConfirmation(
      this.dialog,
      () => this.ownersService.removeOwner(this.course().id!, instructorId),
      this.data,
      instructorId,
    );
  }

  trim(text: string): string {
    if (!text) return '';
    if (text.length < 18) return text;
    return text.substring(0, 16) + '...';
  }

  private findNotOwners(): StakeholderAccount[] {
    return this.allInstructors().filter(i => !this.data().find(o => o.id === i.id));
  }
}
