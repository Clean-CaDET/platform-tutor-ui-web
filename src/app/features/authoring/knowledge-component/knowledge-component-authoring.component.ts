import { Component, ChangeDetectionStrategy, inject, signal, viewChild, ElementRef, afterNextRender, Injector } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KnowledgeComponent } from '../model/knowledge-component.model';
import { KnowledgeComponentAuthoringService } from './knowledge-component-authoring.service';
import { onNavigationEnd } from '../../../core/route.util';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'cc-knowledge-component-authoring',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatDividerModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './knowledge-component-authoring.component.html',
})
export class KnowledgeComponentAuthoringComponent {
  private readonly kcService = inject(KnowledgeComponentAuthoringService);
  private readonly title = inject(Title);

  readonly courseId = signal(0);
  readonly kc = signal<KnowledgeComponent | null>(null);
  readonly prevKc = signal<KnowledgeComponent | null>(null);
  readonly nextKc = signal<KnowledgeComponent | null>(null);

  private readonly injector = inject(Injector);
  private readonly scrollerRef = viewChild<ElementRef>('scroller');

  private allKcs: KnowledgeComponent[] = [];

  constructor() {
    onNavigationEnd((_url, p) => {
      const unitId = +p['unitId'];
      const kcId = +p['kcId'];
      if (!unitId || !kcId) return;
      this.courseId.set(+p['courseId']);
      if (this.allKcs.length) {
        this.setKcs(kcId);
      } else {
        this.loadKcs(unitId, kcId);
      }
    });
  }

  private loadKcs(unitId: number, kcId: number): void {
    this.kcService.getByUnit(unitId).subscribe(kcs => {
      this.allKcs = kcs.sort((a, b) => a.order - b.order);
      this.setKcs(kcId);
    });
  }

  private setKcs(activeKcId: number): void {
    const index = this.allKcs.findIndex(kc => kc.id === activeKcId);
    if (index === -1) return;

    this.kc.set(this.allKcs[index]);
    this.prevKc.set(index > 0 ? this.allKcs[index - 1] : null);
    this.nextKc.set(index < this.allKcs.length - 1 ? this.allKcs[index + 1] : null);
    this.title.setTitle(`Znanje - ${this.allKcs[index].name} - Tutor`);

    afterNextRender(() => {
      this.scrollerRef()?.nativeElement?.scroll({ top: 0 });
    }, { injector: this.injector });
  }
}
