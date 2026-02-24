import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CcMarkdownComponent } from '../../../../shared/markdown/cc-markdown.component';
import { Unit } from '../../../../shared/model/unit.model';
import { UnitItem, UnitItemType, KcUnitItem } from '../../model/unit-item.model';
import { KcWithMastery } from '../../model/kc-with-mastery.model';
import { UnitService } from '../unit.service';
import { UnitItemComponent } from '../unit-item/unit-item.component';
import { onNavigationEnd } from '../../../../core/route.util';

@Component({
  selector: 'cc-unit-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, MatCardModule, MatIconModule, MatButtonModule,
    MatProgressBarModule, MatTooltipModule, CcMarkdownComponent, UnitItemComponent,
  ],
  templateUrl: './unit-details.component.html',
  styleUrl: './unit-details.component.scss',
})
export class UnitDetailsComponent {
  private readonly unitService = inject(UnitService);
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
        return this.unitService.getKcsWithMasteries(unitId);
      }),
    ).subscribe({
      next: kcResults => this.createUnitItems(kcResults),
      error: () => this.error.set('Sadržaj nije ispravno dobavljen.'),
    });
  }

  private createUnitItems(kcResults: KcWithMastery[]): void {
    const items: KcUnitItem[] = kcResults.map(kcResult => ({
      id: kcResult.knowledgeComponent.id!,
      order: kcResult.knowledgeComponent.order,
      name: kcResult.knowledgeComponent.name,
      type: UnitItemType.Kc as const,
      isSatisfied: kcResult.mastery.isSatisfied,
      isNext: false,
      kc: kcResult.knowledgeComponent,
      kcMastery: kcResult.mastery,
    }));

    items.sort((a, b) => a.order - b.order);

    const firstUnsatisfied = items.find(i => !i.isSatisfied);
    if (firstUnsatisfied) firstUnsatisfied.isNext = true;

    if (items.length === 0) {
      this.error.set('Lekcija nema sadržaj.');
    }

    this.unitItems.set(items);
  }
}
