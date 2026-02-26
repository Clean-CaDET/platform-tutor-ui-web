import { Component, ChangeDetectionStrategy, inject, input, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CrudService } from '../../../../shared/generics/generic-table/crud.service';
import { deleteWithConfirmation } from '../../../../shared/generics/delete-form/delete-with-confirmation.util';
import { BulkEnrollLearnersComponent } from '../bulk-enroll-learners/bulk-enroll-learners.component';
import { Group } from '../../model/group.model';
import { StakeholderAccount } from '../../model/stakeholder-account.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'cc-enrolled-learners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './enrolled-learners.component.html',
})
export class EnrolledLearnersComponent {
  private readonly dialog = inject(MatDialog);
  private readonly membershipService = inject<CrudService<StakeholderAccount>>(CrudService);

  readonly group = input.required<Group>();
  readonly columns = ['index', 'name', 'surname', 'CRUD'];

  private readonly membersResource = rxResource({
    params: () => this.group(),
    stream: ({ params: group }) =>
      this.membershipService.getAll(this.buildBaseUrl(group.id), null),
    defaultValue: { results: [], totalCount: 0 },
  });

  readonly data = linkedSignal(() => this.membersResource.value().results);

  private buildBaseUrl(groupId: number): string {
    return environment.apiHost + 'management/groups/' + groupId + '/members/';
  }

  onAddBulk(): void {
    const dialogRef = this.dialog.open(BulkEnrollLearnersComponent, { minHeight: '600px', minWidth: '900px' });
    dialogRef.afterClosed().subscribe((learners: StakeholderAccount[]) => {
      if (!learners) return;
      this.membershipService.bulkCreate(this.buildBaseUrl(this.group().id), learners).subscribe(() => {
        const existing = this.data().map(e => e.index);
        const newLearners = learners.filter(l => !existing.includes(l.index));
        this.data.update(d => [...d, ...newLearners]);
      });
    });
  }

  onDelete(learnerId: number): void {
    deleteWithConfirmation(
      this.dialog,
      () => this.membershipService.delete(this.buildBaseUrl(this.group().id), learnerId),
      this.data,
      learnerId,
    );
  }

  trim(text: string): string {
    if (!text) return '';
    if (text.length < 18) return text;
    return text.substring(0, 16) + '...';
  }
}
