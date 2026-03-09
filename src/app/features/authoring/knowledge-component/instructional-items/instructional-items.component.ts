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
import { InstructionalItem, TextLearningObject, VideoLearningObject } from '../../../learning/model/learning-object.model';
import { LearningObjectContainerComponent } from '../../../learning/knowledge-component/learning-object-container/learning-object-container.component';
import { MarkdownEditorComponent } from '../../../../shared/markdown/markdown-editor/markdown-editor.component';
import { DeleteFormComponent } from '../../../../shared/generics/delete-form/delete-form.component';
import { CanComponentDeactivate } from '../../../../core/confirm-exit.guard';
import { InstructionalItemsService } from './instructional-items.service';
import { AuthoringPromptsService } from '../../authoring-prompts.service';
import { VideoAuthoringComponent } from './video-authoring/video-authoring.component';
import { getRouteParams, onNavigationEnd } from '../../../../core/route.util';

@Component({
  selector: 'cc-instructional-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule,
    LearningObjectContainerComponent, MarkdownEditorComponent, VideoAuthoringComponent,
  ],
  templateUrl: './instructional-items.component.html',
})
export class InstructionalItemsComponent implements CanComponentDeactivate {
  private readonly instructionService = inject(InstructionalItemsService);
  private readonly promptService = inject(AuthoringPromptsService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly clipboard = inject(Clipboard);
  private readonly hostEl = inject(ElementRef);

  readonly instructionalItems = signal<InstructionalItem[]>([]);
  readonly editMap = signal<Record<number | string, boolean | string>>({});
  readonly emptyVideo = signal<VideoLearningObject | null>(null);
  readonly reordering = signal(false);
  readonly selectedIi = signal<number>(0);

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
      return confirm('Neko gradivo se ažurira i izmene nisu sačuvane.\nDa li želite da napustite stranicu?');
    }
    return true;
  }

  private loadItems(): void {
    this.instructionService.getAll(this.kcId).subscribe(items => {
      this.instructionalItems.set(items.sort((a, b) => a.order - b.order));
      const map: Record<number, boolean> = {};
      items.forEach(i => map[i.id] = false);
      this.editMap.set(map);

      const iiId = +this.route.snapshot.queryParams['iiId'];
      if (iiId) {
        this.selectedIi.set(iiId);
        this.scrollDeferred(iiId.toString());
      }
    });
  }

  swapOrder(firstItem: InstructionalItem, secondItem: InstructionalItem): void {
    const swapped = [
      { ...firstItem, order: secondItem.order },
      { ...secondItem, order: firstItem.order },
    ];
    this.reordering.set(true);
    this.instructionService.updateOrdering(this.kcId, swapped).subscribe({
      next: () => {
        this.instructionalItems.update(items =>
          items.map(i => {
            if (i.id === firstItem.id) return { ...i, order: secondItem.order };
            if (i.id === secondItem.id) return { ...i, order: firstItem.order };
            return i;
          }).sort((a, b) => a.order - b.order)
        );
        this.reordering.set(false);
        this.scrollDeferred(firstItem.id.toString());
      },
      error: () => this.reordering.set(false),
    });
  }

  setEditing(id: number | string, value: boolean | string): void {
    this.editMap.update(m => ({ ...m, [id]: value }));
    if (id === 0 && value === 'video') {
      this.emptyVideo.set({
        $type: 'video',
        knowledgeComponentId: this.kcId,
        order: this.getMaxOrder() + 1,
        url: '',
        caption: '',
      } as VideoLearningObject);
    }
  }

  asText(item: InstructionalItem): TextLearningObject { return item as TextLearningObject; }
  asVideo(item: InstructionalItem): VideoLearningObject { return item as VideoLearningObject; }

  updateMarkdownItem(updatedText: string | undefined, item: TextLearningObject): void {
    if (!updatedText || item.content === updatedText) {
      this.setEditing(item.id, false);
      return;
    }
    const updated = { ...item, content: updatedText };
    this.instructionService.update(item.knowledgeComponentId, updated).subscribe(() => {
      this.instructionalItems.update(items =>
        items.map(i => i.id === item.id ? updated : i)
      );
      this.setEditing(item.id, false);
    });
  }

  updateVideoItem(updatedItem: VideoLearningObject | null, itemId: number): void {
    if (!updatedItem) {
      this.setEditing(itemId, false);
      return;
    }
    this.instructionService.update(this.kcId, updatedItem).subscribe(response => {
      this.instructionalItems.update(items =>
        items.map(i => i.id === itemId ? response : i)
      );
      this.setEditing(itemId, false);
    });
  }

  deleteItem(itemId: number): void {
    this.dialog.open(DeleteFormComponent).afterClosed().pipe(
      filter(Boolean),
      switchMap(() => this.instructionService.delete(this.kcId, itemId)),
    ).subscribe(() => {
      this.instructionalItems.update(items => items.filter(i => i.id !== itemId));
    });
  }

  createMarkdown(newText: string | undefined): void {
    if (!newText) {
      this.setEditing(0, false);
      return;
    }
    const newItem = {
      $type: 'text' as const,
      knowledgeComponentId: this.kcId,
      content: newText,
      order: this.getMaxOrder() + 1,
    } as InstructionalItem;
    this.instructionService.create(this.kcId, newItem).subscribe(item => {
      this.setEditing(0, false);
      this.instructionalItems.update(items => [...items, item]);
    });
  }

  createVideoItem(newItem: VideoLearningObject | null): void {
    if (!newItem) {
      this.setEditing(0, false);
      this.emptyVideo.set(null);
      return;
    }
    this.instructionService.create(this.kcId, newItem).subscribe(item => {
      this.setEditing(0, false);
      this.emptyVideo.set(null);
      this.instructionalItems.update(items => [...items, item]);
    });
  }

  copyPrompt(promptCode: string): void {
    this.promptService.getAll('authoring').subscribe(prompts => {
      const systemPrompt = prompts.find(p => p.code === promptCode);
      if (!systemPrompt) return;

      const allItems = this.instructionalItems().map(i => this.prepareForPrompt(i)).join('\n');
      this.clipboard.copy(`${systemPrompt.content}\n<instructional-items>${allItems}</instructional-items>`);
    });
  }

  private prepareForPrompt(item: InstructionalItem): string {
    switch (item.$type) {
      case 'text': return item.content;
      case 'image': return `Slika: ${item.caption}`;
      case 'video': return `Video koji razmatra: ${item.caption}`;
    }
  }

  copyLink(iiId: number): void {
    this.selectedIi.set(iiId);
    const baseUrl = window.location.href.split('?')[0];
    this.clipboard.copy(baseUrl + '?iiId=' + iiId);
  }

  private scroll(elem: string): void {
    if (!elem) return;
    (this.hostEl.nativeElement as HTMLElement)
      .querySelector('#i' + elem)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private scrollDeferred(elem: string): void {
    setTimeout(() => this.scroll(elem), 100);
  }

  private getMaxOrder(): number {
    const items = this.instructionalItems();
    if (items.length === 0) return 1;
    return Math.max(...items.map(i => i.order));
  }
}
