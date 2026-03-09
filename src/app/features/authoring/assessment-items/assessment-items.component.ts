import { Component, ChangeDetectionStrategy, inject, signal, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, switchMap } from 'rxjs';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';
import { DeleteFormComponent } from '../../../shared/generics/delete-form/delete-form.component';
import { CanComponentDeactivate } from '../../../core/confirm-exit.guard';
import { AssessmentItemsService } from './assessment-items.service';
import { AuthoringPromptsService } from '../authoring-prompts.service';
import { AuthoringAssessmentItem, AuthoringMcq, AuthoringMrq, AuthoringSaq } from './model/assessment-item.model';
import { prepareForPrompt } from './prompt.utility';
import { SubmissionStatisticsComponent } from '../../../shared/submission-statistics/submission-statistics.component';
import { McqFormComponent } from './mcq-form/mcq-form.component';
import { MrqFormComponent } from './mrq-form/mrq-form.component';
import { SaqFormComponent } from './saq-form/saq-form.component';
import { getRouteParams, onNavigationEnd } from '../../../core/route.util';

const TYPE_LABELS: Record<string, string> = {
  multiChoiceQuestion: 'Pitanje sa višestrukim izborom i jednim odgovorom',
  multiResponseQuestion: 'Pitanje sa višestrukim izborom i više odgovara',
  shortAnswerQuestion: 'Otvoreno pitanje sa kratkim odgovorom',
};

@Component({
  selector: 'cc-assessment-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule,
    CcMarkdownComponent, McqFormComponent, MrqFormComponent, SaqFormComponent,
  ],
  templateUrl: './assessment-items.component.html',
  styleUrl: './assessment-items.component.scss',
})
export class AssessmentItemsComponent implements CanComponentDeactivate {
  private readonly assessmentService = inject(AssessmentItemsService);
  private readonly promptService = inject(AuthoringPromptsService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly clipboard = inject(Clipboard);
  private readonly hostEl = inject(ElementRef);

  readonly assessmentItems = signal<AuthoringAssessmentItem[]>([]);
  readonly editMap = signal<Record<number | string, boolean | AuthoringAssessmentItem>>({});
  readonly selectedAi = signal<number>(0);
  readonly reordering = signal(false);

  private kcId = 0;

  constructor() {
    const params = getRouteParams(this.route);
    this.kcId = +params['kcId'];
    this.loadItems();

    onNavigationEnd((_url, p) => {
      const newKcId = +p['kcId'];
      if (newKcId && newKcId !== this.kcId) {
        this.kcId = newKcId;
        this.loadItems();
      }
    });
  }

  canDeactivate(): boolean {
    if (Object.values(this.editMap()).some(value => value)) {
      return confirm('Neko pitanje se ažurira i izmene nisu sačuvane.\nDa li želite da napustite stranicu?');
    }
    return true;
  }

  private loadItems(): void {
    this.assessmentService.getAll(this.kcId).subscribe(items => {
      this.assessmentItems.set(items.sort((a, b) => a.order - b.order));
      const map: Record<number, boolean> = {};
      items.forEach(i => { if (i.id != null) map[i.id] = false; });
      this.editMap.set(map);

      const aiId = +this.route.snapshot.queryParams['aiId'];
      if (aiId) {
        this.selectedAi.set(aiId);
        this.scrollDeferred(aiId.toString());
      }
    });
  }

  private scroll(elem: string): void {
    if (!elem) return;
    (this.hostEl.nativeElement as HTMLElement)
      .querySelector('#a' + elem)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private scrollDeferred(elem: string): void {
    setTimeout(() => this.scroll(elem), 100);
  }

  getTypeLabel(type: string): string {
    return TYPE_LABELS[type] ?? '';
  }

  setEditing(id: number | string, value: boolean | AuthoringAssessmentItem): void {
    this.editMap.update(m => ({ ...m, [id]: value }));
  }

  swapOrder(firstItem: AuthoringAssessmentItem, secondItem: AuthoringAssessmentItem): void {
    const firstOrder = firstItem.order;
    const secondOrder = secondItem.order;

    const swappedFirst = { ...firstItem, order: secondOrder };
    const swappedSecond = { ...secondItem, order: firstOrder };

    this.reordering.set(true);
    this.assessmentService.updateOrdering(this.kcId, [swappedFirst, swappedSecond]).subscribe({
      next: items => {
        const remaining = this.assessmentItems().filter(i => i.id !== items[0].id && i.id !== items[1].id);
        this.assessmentItems.set([...remaining, ...items].sort((a, b) => a.order - b.order));
        this.scrollDeferred((firstItem.id ?? '').toString());
        this.reordering.set(false);
      },
      error: () => this.reordering.set(false),
    });
  }

  deleteItem(itemId: number): void {
    this.dialog.open(DeleteFormComponent).afterClosed().pipe(
      filter(Boolean),
      switchMap(() => this.assessmentService.delete(this.kcId, itemId)),
    ).subscribe(() => {
      this.assessmentItems.update(items => items.filter(i => i.id !== itemId));
    });
  }

  onCloseForm(item: AuthoringAssessmentItem | null, id?: number): void {
    if (!item) {
      if (id) this.setEditing(id, false);
      else this.setEditing(0, false);
      return;
    }
    if (id) this.updateItem(item);
    else this.createItem(item);
  }

  private updateItem(item: AuthoringAssessmentItem): void {
    this.assessmentService.update(this.kcId, item).subscribe(response => {
      this.assessmentItems.update(items =>
        items.map(i => i.id === item.id ? response : i)
      );
      if (item.id != null) this.setEditing(item.id, false);
    });
  }

  private createItem(item: AuthoringAssessmentItem): void {
    this.assessmentService.create(this.kcId, item).subscribe(response => {
      this.assessmentItems.update(items => [...items, response]);
      this.setEditing(0, false);
    });
  }

  cloneItem(item: AuthoringAssessmentItem): void {
    const cloned = JSON.parse(JSON.stringify(item)) as AuthoringAssessmentItem;
    delete (cloned as unknown as Record<string, unknown>)['id'];
    cloned.order = this.getMaxOrder() + 1;
    this.setEditing(0, cloned);
    this.scrollDeferred('form');
  }

  createEmptyItem(type: 'multiChoiceQuestion' | 'multiResponseQuestion' | 'shortAnswerQuestion'): void {
    const base = {
      knowledgeComponentId: this.kcId,
      text: '',
      order: this.getMaxOrder() + 1,
      hints: [],
    };
    let item: AuthoringAssessmentItem;
    switch (type) {
      case 'multiChoiceQuestion':
        item = { $type: type, ...base, possibleAnswers: [], correctAnswer: '', feedback: '' };
        break;
      case 'multiResponseQuestion':
        item = { $type: type, ...base, items: [] };
        break;
      case 'shortAnswerQuestion':
        item = { $type: type, ...base, acceptableAnswers: [], feedback: '', tolerance: 0 };
        break;
    }
    this.setEditing(0, item);
  }

  copyLink(aiId: number): void {
    this.selectedAi.set(aiId);
    const baseUrl = window.location.href.split('?')[0];
    this.clipboard.copy(baseUrl + '?aiId=' + aiId);
  }

  viewCommonWrongAnswers(aiId: number): void {
    this.dialog.open(SubmissionStatisticsComponent, {
      minHeight: '800px',
      minWidth: '800px',
      data: { kcId: this.kcId, aiId },
    });
  }

  copyPrompt(ai?: AuthoringAssessmentItem): void {
    this.promptService.getAll('authoring').subscribe(prompts => {
      const assessmentPrompt = prompts.find(p => p.code === 'questions');
      if (!assessmentPrompt) return;

      if (ai) {
        if (ai.id != null) this.selectedAi.set(ai.id);
        this.clipboard.copy(assessmentPrompt.content + prepareForPrompt(ai));
      } else {
        const allQuestions = this.assessmentItems().map(a => prepareForPrompt(a)).join('\n');
        this.clipboard.copy(`${assessmentPrompt.content}\n<questions>${allQuestions}</questions>`);
      }
    });
  }

  asMcq(item: AuthoringAssessmentItem): AuthoringMcq { return item as AuthoringMcq; }
  asMrq(item: AuthoringAssessmentItem): AuthoringMrq { return item as AuthoringMrq; }
  asSaq(item: AuthoringAssessmentItem): AuthoringSaq { return item as AuthoringSaq; }

  getEditMapItem(key: number | string): AuthoringAssessmentItem | undefined {
    const val = this.editMap()[key];
    return typeof val === 'object' && val !== null ? val as AuthoringAssessmentItem : undefined;
  }

  private getMaxOrder(): number {
    const items = this.assessmentItems();
    if (items.length === 0) return 0;
    return Math.max(...items.map(i => i.order));
  }
}
