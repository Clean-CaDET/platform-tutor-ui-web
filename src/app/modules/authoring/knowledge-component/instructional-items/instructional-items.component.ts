import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Text } from 'src/app/modules/learning/knowledge-component/learning-objects/instructional-items/text/text.model';
import { Video } from 'src/app/modules/learning/knowledge-component/learning-objects/instructional-items/video/video.model';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { LearningObject } from '../../../learning/knowledge-component/learning-objects/learning-object.model';
import { InstructionalItemsService } from './instructional-items.service';
import { CanComponentDeactivate } from 'src/app/infrastructure/confirm-leave.guard';
import { AuthoringPromptsService } from '../../authoring-prompts.service';

@Component({
  selector: 'cc-instructional-items',
  templateUrl: './instructional-items.component.html',
  styleUrls: ['./instructional-items.component.scss']
})
export class InstructionalItemsComponent implements OnInit, CanComponentDeactivate {
  kcId: number;
  instructionalItems: LearningObject[];
  editMap: any = {};

  constructor(private instructionService: InstructionalItemsService, private promptService: AuthoringPromptsService,
    private route: ActivatedRoute, private dialog: MatDialog, private clipboard: Clipboard) { }

  canDeactivate(): boolean {
    if (Object.values(this.editMap).some(value => value)) {
      return confirm('Neko gradivo se ažurira i izmene nisu sačuvane.\nDa li želite da napustite stranicu?');
    }
    return true;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.kcId = +params.kcId;
      this.instructionService.getAll(this.kcId).subscribe(instructionalItems => {
        this.instructionalItems = instructionalItems.sort((a, b) => a.order - b.order);
        this.editMap = {};
        this.instructionalItems.forEach(i => this.editMap[i.id] = false);
      });
    });
  }

  swapOrder(firstItem: LearningObject, secondItem: LearningObject) {
    let secondOrder = secondItem.order;
    secondItem.order = firstItem.order;
    firstItem.order = secondOrder;

    this.instructionService.updateOrdering(this.kcId, this.instructionalItems).subscribe(items => {
      this.instructionalItems = items.sort((a, b) => a.order - b.order);
    });
  }

  updateMarkdownItem(updatedText: string, item: Text): void {
    if(!updatedText || item.content === updatedText) {
      this.editMap[item.id] = false;
      return;
    }
    item.content = updatedText;
    this.instructionService.update(item.knowledgeComponentId, item).subscribe(response => {
      // Should be cleaned to update content only after successful responses.
      this.editMap[item.id] = false;
    });
  }

  updateVideoItem(updatedItem: Video, itemId: number): void {
    if(!updatedItem) {
      this.editMap[itemId] = false;
      return;
    };
    this.instructionService.update(this.kcId, updatedItem).subscribe(response => {
      let item = this.instructionalItems.find(i => i.id === itemId) as Video;
      item.caption = (response as Video).caption;
      item.url = (response as Video).url;
      this.editMap[itemId] = false;
    });
  }

  deleteItem(itemId: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(!result) return;

      this.instructionService.delete(this.kcId, itemId).subscribe(() => {
        this.instructionalItems = [...this.instructionalItems.filter(i => i.id !== itemId)];
      });
    });
  }

  createMarkdown(newText: string) {
    if(!newText) {
      this.editMap[0] = false;
      return;
    }
    let newItem = new Text({
      $type: 'text',
      knowledgeComponentId: this.kcId,
      content: newText,
      order: this.getMaxOrder()+1
    });
    this.instructionService.create(this.kcId, newItem).subscribe(item => {
      this.editMap[0] = false;
      this.instructionalItems.push(item);
    });
  }

  private getMaxOrder() {
    if(this.instructionalItems.length === 0) return 1;
    return Math.max(...this.instructionalItems.map(i => i.order));
  }

  createEmptyVideo(): Video {
    return new Video({
      knowledgeComponentId: this.kcId,
      $type: 'video',
      order: this.getMaxOrder()+1
    });
  }

  createVideoItem(newItem: Video): void {
    if(!newItem) {
      this.editMap[0] = false;
      return;
    };
    this.instructionService.create(this.kcId, newItem).subscribe(item => {
      this.editMap[0] = false;
      this.instructionalItems.push(item);
    });
  }

  copyPrompt(promptCode: string) {
    this.promptService.getAll('authoring').subscribe(prompts => {
      const systemPrompt = prompts.find(p => p.code === promptCode);
      if(!systemPrompt) return;
      
      const allItems = this.instructionalItems.map(i => this.prepareForPrompt(i)).join("\n");
      this.clipboard.copy(`${systemPrompt.content}\n<instructional-items>${allItems}</instructional-items>`);
    });
  }

  prepareForPrompt(item: LearningObject): string {
    switch(item.$type) {
      case 'text': return `${(item as Text).content}`;
      case 'video': return `Video koji razmatra: ${(item as Video).caption}`;
    }
    return "";
  }
}
