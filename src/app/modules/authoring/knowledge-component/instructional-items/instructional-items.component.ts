import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Text } from 'src/app/modules/learning/knowledge-component/learning-objects/instructional-items/text/text.model';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { LearningObject } from '../../../learning/knowledge-component/learning-objects/learning-object.model';
import { InstructionalItemsService } from './instructional-items.service';

@Component({
  selector: 'cc-instructional-items',
  templateUrl: './instructional-items.component.html',
  styleUrls: ['./instructional-items.component.scss']
})
export class InstructionalItemsComponent implements OnInit {
  kcId: number;
  instructionalItems: LearningObject[];
  editMap: any = {};

  constructor(private instructionService: InstructionalItemsService, private route: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.kcId = +params.kcId;
      this.instructionService.getAll(this.kcId).subscribe(instructionalItems => {
        this.instructionalItems = instructionalItems;
        this.editMap = {};
        this.instructionalItems.forEach(i => this.editMap[i.id] = false);
      });
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
      knowledgeComponentId: this.kcId,
      content: newText,
      typeDiscriminator: 'text',
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

  updateMarkdownItem(updatedText: string, item: Text) {
    if(!updatedText || item.content === updatedText) {
      this.editMap[item.id] = false;
      return;
    }
    item.content = updatedText;
    this.instructionService.update(item.knowledgeComponentId, item).subscribe(response => {
      this.editMap[item.id] = false;
    });
  }

  createVideo() {

  }
}