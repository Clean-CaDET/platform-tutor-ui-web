import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { switchMap, forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CcMarkdownComponent } from '../../../../shared/markdown/cc-markdown.component';
import { Unit } from '../../model/unit.model';
import { UnitItem, UnitItemType, KcUnitItem, TaskUnitItem, ReflectionUnitItem } from '../../model/unit-item.model';
import { KcWithMastery } from '../../model/kc-with-mastery.model';
import { TaskProgressSummary } from '../../model/task-progress-summary.model';
import { Reflection } from '../../reflection/reflection.model';
import { UnitService } from '../unit.service';
import { TaskService } from '../../task/task.service';
import { ReflectionService } from '../../reflection/reflection.service';
import { UnitItemComponent } from '../unit-item/unit-item.component';
import { onNavigationEnd } from '../../../../core/route.util';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'cc-unit-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, MatIconModule, MatButtonModule, MatDividerModule,
    MatProgressBarModule, MatTooltipModule, CcMarkdownComponent, UnitItemComponent,
  ],
  templateUrl: './unit-details.component.html',
  styleUrl: './unit-details.component.scss',
})
export class UnitDetailsComponent {
  private readonly unitService = inject(UnitService);
  private readonly taskService = inject(TaskService);
  private readonly reflectionService = inject(ReflectionService);
  private readonly title = inject(Title);
  private readonly route = inject(ActivatedRoute);
  private loadedUnitId = 0;

  readonly unit = signal<Unit | null>(null);
  readonly unitItems = signal<UnitItem[]>([]);
  readonly error = signal<string | null>(null);
  readonly courseId = signal(0);

  readonly percentMastered = computed(() => {
    const items = this.unitItems();
    if (!items.length) return 0;
    const satisfiedCount = items.filter(i => i.isSatisfied).length;
    return Math.round(100 * satisfiedCount / items.length);
  });

  constructor() {
    const params = this.route.snapshot.params;
    this.loadUnit(+params['courseId'], +params['unitId']);

    onNavigationEnd((_url, p) => {
      const cId = +p['courseId'];
      const uId = +p['unitId'];
      if (cId && uId) this.loadUnit(cId, uId);
    });
  }

  private loadUnit(courseId: number, unitId: number): void {
    if (!courseId || !unitId || unitId === this.loadedUnitId) return;
    this.loadedUnitId = unitId;
    this.courseId.set(courseId);

    this.unitService.getUnit(courseId, unitId).pipe(
      switchMap(unit => {
        this.error.set(null);
        this.unit.set(unit);
        this.title.setTitle(`${unit.name} - Tutor`);
        return forkJoin([
          this.unitService.getKcsWithMasteries(unitId),
          this.taskService.getByUnit(unitId),
          this.reflectionService.getByUnit(unitId),
        ]);
      }),
    ).subscribe({
      next: ([kcResults, taskResults, reflections]) =>
        this.createUnitItems(kcResults, taskResults, reflections),
      error: () => this.error.set('Sadržaj nije ispravno dobavljen.'),
    });
  }

  private createUnitItems(
    kcResults: KcWithMastery[],
    taskResults: TaskProgressSummary[],
    reflections: Reflection[],
  ): void {
    const items: UnitItem[] = [];

    kcResults.forEach(kcResult => {
      items.push({
        id: kcResult.knowledgeComponent.id!,
        order: kcResult.knowledgeComponent.order,
        name: kcResult.knowledgeComponent.name,
        type: UnitItemType.Kc as const,
        isSatisfied: kcResult.mastery.isSatisfied,
        isNext: false,
        kc: kcResult.knowledgeComponent,
        kcMastery: kcResult.mastery,
      } satisfies KcUnitItem);
    });

    taskResults.forEach(taskResult => {
      items.push({
        id: taskResult.id,
        order: taskResult.order,
        name: taskResult.name,
        type: UnitItemType.Task as const,
        isNext: false,
        isSatisfied: taskResult.status === 'Completed' || taskResult.status === 'Graded',
        task: taskResult,
      } satisfies TaskUnitItem);
    });

    reflections.forEach(reflection => {
      items.push({
        id: reflection.id,
        order: reflection.order,
        name: reflection.name,
        type: UnitItemType.Reflection as const,
        isNext: false,
        isSatisfied: (reflection.submissions?.length ?? 0) > 0,
      } satisfies ReflectionUnitItem);
    });

    items.sort((a, b) => a.order - b.order);

    const firstUnsatisfied = items.find(i => !i.isSatisfied);
    if (firstUnsatisfied) firstUnsatisfied.isNext = true;

    if (items.length === 0) {
      this.error.set('Lekcija nema sadržaj.');
    }

    this.unitItems.set(items);
  }
}
