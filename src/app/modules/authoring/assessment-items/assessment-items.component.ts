import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { AssessmentItemsService } from './assessment-items.service';
import { AssessmentItem } from './model/assessment-item.model';

@Component({
  selector: 'cc-assessment-items',
  templateUrl: './assessment-items.component.html',
  styleUrls: ['./assessment-items.component.scss']
})
export class AssessmentItemsComponent implements OnInit {
  kcId: number;
  assessmentItems: AssessmentItem[];
  editMap: any = {};

  constructor(private assessmentService: AssessmentItemsService, private route: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.kcId = +params.kcId;
      this.assessmentService.getAll(this.kcId).subscribe(items => {
        this.assessmentItems = items.sort((a, b) => a.order - b.order);
        this.editMap = {};
        this.assessmentItems.forEach(i => this.editMap[i.id] = false);
        setTimeout(() => this.scroll(this.route.snapshot.queryParams['aiId']), 200);
      });
    });
  }

  scroll(elem: string) {
    if(!elem) return;
    const element = document.querySelector('#a'+elem)!;
    element.scrollIntoView({behavior: 'smooth', block:'center'});
  }

  getTypeLabel(type: string): string {
    switch(type) {
      case 'multiChoiceQuestion': return 'Pitanje sa višestrukim izborom i jednim odgovorom';
      case 'multiResponseQuestion': return 'Pitanje sa višestrukim izborom i više odgovara';
      case 'shortAnswerQuestion': return 'Otvoreno pitanje sa kratkim odgovorom';
    }
    return "";
  }

  swapOrder(firstItem: AssessmentItem, secondItem: AssessmentItem): void {
    let secondOrder = secondItem.order;
    secondItem.order = firstItem.order;
    firstItem.order = secondOrder;

    this.assessmentService.updateOrdering(this.kcId, [firstItem, secondItem]).subscribe(items => {
      let updatedItems = this.assessmentItems.filter(i => i.id !== items[0].id && i.id !== items[1].id);
      this.assessmentItems = updatedItems.concat(items).sort((a, b) => a.order - b.order);
    });
  }

  deleteItem(itemId: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(!result) return;
      
      this.assessmentService.delete(this.kcId, itemId).subscribe(() => {
        this.assessmentItems = [...this.assessmentItems.filter(i => i.id !== itemId)];
      });
    });
  }

  onCloseForm(item: AssessmentItem, id?: number): void {
    if(!item) {
      if(id) this.editMap[id] = false;
      else this.editMap[0] = false;
      return;
    }

    if(id) this.updateItem(item);
    else this.createItem(item);
  }
  
  private updateItem(item: AssessmentItem) {
    this.assessmentService.update(this.kcId, item).subscribe(response => {
      let oldItem = this.assessmentItems.find(i => i.id === item.id);
      Object.assign(oldItem, response);
      
      this.editMap[item.id] = false;
    });
  }

  private createItem(item: AssessmentItem) {
    this.assessmentService.create(this.kcId, item).subscribe(response => {
      this.assessmentItems.push(response);
      this.editMap[0] = false;
    });
  }

  createEmptyItem(type: string): AssessmentItem {
    return new AssessmentItem({
      typeDiscriminator: type,
      knowledgeComponentId: this.kcId,
      order: this.getMaxOrder()+1
    });
  }

  private getMaxOrder() {
    if(this.assessmentItems.length === 0) return 0;
    return Math.max(...this.assessmentItems.map(i => i.order));
  }
}
