import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getRouteParams } from '../../../core/route.util';
import { CanComponentDeactivate } from '../../../core/confirm-exit.guard';

@Component({
  selector: 'cc-concept-elaboration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './concept-elaboration.component.html',
  styleUrl: './concept-elaboration.component.scss',
})
export class ConceptElaborationComponent implements CanComponentDeactivate {
  private readonly route = inject(ActivatedRoute);

  readonly taskId = signal(0);
  readonly unitId = signal(0);
  readonly courseId = signal(0);

  constructor() {
    const params = getRouteParams(this.route);
    this.taskId.set(+params['taskId']);
    this.unitId.set(+params['unitId']);
    this.courseId.set(+params['courseId']);
  }

  canDeactivate(): boolean {
    return true;
  }
}
