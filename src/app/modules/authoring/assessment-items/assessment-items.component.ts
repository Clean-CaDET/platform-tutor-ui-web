import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
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
      });
    });
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

}
