import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ConceptRecordsComponent } from '../concept-records/concept-records.component';
import { ElaborationTasksComponent } from './elaboration-tasks.component';

@Component({
  selector: 'cc-elaboration-authoring',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDividerModule, ConceptRecordsComponent, ElaborationTasksComponent],
  template: `
    <div class="flex-row" style="height: 100%; gap: 0;">
      <div style="width: 50%; overflow-y: auto;">
        <cc-concept-records [courseId]="courseId()" />
      </div>
      <mat-divider vertical />
      <div style="width: 50%; overflow-y: auto;">
        <cc-elaboration-tasks [unitId]="unitId()" [courseId]="courseId()" />
      </div>
    </div>
  `,
})
export class ElaborationAuthoringComponent {
  readonly unitId = input.required<number>();
  readonly courseId = input.required<number>();
}
