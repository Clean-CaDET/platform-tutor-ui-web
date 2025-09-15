import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { AssessmentItemsService } from './assessment-items.service';
import { AssessmentItem } from './model/assessment-item.model';
import { SubmissionStatisticsComponent } from '../../knowledge-analytics/submission-statistics/submission-statistics.component';
import { CanComponentDeactivate } from 'src/app/infrastructure/confirm-leave.guard';
import { AuthoringPromptsService } from '../authoring-prompts.service';
import { prepareForPrompt } from './prompt.utility';

@Component({
  selector: 'cc-assessment-items',
  templateUrl: './assessment-items.component.html',
  styleUrls: ['./assessment-items.component.scss']
})
export class AssessmentItemsComponent implements OnInit, CanComponentDeactivate {
  kcId: number;
  assessmentItems: AssessmentItem[];
  editMap: any = {};
  clone: boolean = false;
  selectedAi: number;

  constructor(private assessmentService: AssessmentItemsService, private promptService: AuthoringPromptsService,
    private route: ActivatedRoute, private dialog: MatDialog, private clipboard: Clipboard) { }
  
  canDeactivate(): boolean {
    if (Object.values(this.editMap).some(value => value)) {
      return confirm('Neko pitanje se ažurira i izmene nisu sačuvane.\nDa li želite da napustite stranicu?');
    }
    return true;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.kcId = +params.kcId;
      this.assessmentService.getAll(this.kcId).subscribe(items => {
        this.assessmentItems = items.sort((a, b) => a.order - b.order);
        this.editMap = {};
        this.assessmentItems.forEach(i => this.editMap[i.id] = false);
        this.selectedAi = +this.route.snapshot.queryParams['aiId'];
        setTimeout(() => this.scroll(this.route.snapshot.queryParams['aiId']), 100);
      });
    });
  }

  scroll(elem: string) {
    if(!elem) return;
    const element = document.querySelector('#a'+elem)!;
    element.scrollIntoView({behavior: 'smooth', block:'start'});
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
      setTimeout(() => this.scroll(firstItem.id.toString()), 50);
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

  cloneItem(item: AssessmentItem): void {
    let clonedItem = JSON.parse(JSON.stringify(item));
    delete clonedItem.id
    clonedItem.order = this.getMaxOrder()+1;
    this.editMap[0] = clonedItem;

    setTimeout(() => this.scroll('form'), 50);
  }

  createEmptyItem(type: string): void {
    this.editMap[0] = new AssessmentItem({
      $type: type,
      knowledgeComponentId: this.kcId,
      order: this.getMaxOrder()+1
    });
  }

  private getMaxOrder() {
    if(this.assessmentItems.length === 0) return 0;
    return Math.max(...this.assessmentItems.map(i => i.order));
  }

  viewCommonWrongAnswers(aiId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxHeight = '800px';
    dialogConfig.maxWidth = '800px';
    dialogConfig.data = {
      kcId: this.kcId,
      aiId
    };
    this.dialog.open(SubmissionStatisticsComponent, dialogConfig)
  }

  copyLink(aiId: number) {
    this.selectedAi = aiId;
    const baseUrl = window.location.href.split('?')[0];
    this.clipboard.copy(baseUrl + "?aiId=" + aiId);
  }

  copyPrompt(ai?: AssessmentItem) {
    this.promptService.getAll('authoring').subscribe(prompts => {
      const assessmentPrompt = prompts.find(p => p.code === 'questions');
      if(!assessmentPrompt) return;
      
      if(ai) {
        this.selectedAi = ai.id;
        this.clipboard.copy(assessmentPrompt.content + prepareForPrompt(ai));
      } else {
        const allQuestions = this.assessmentItems.map(a => prepareForPrompt(a)).join("\n");
        this.clipboard.copy(`${assessmentPrompt.content}\n<questions>${allQuestions}</questions>`);
      }
    });
  }
}
