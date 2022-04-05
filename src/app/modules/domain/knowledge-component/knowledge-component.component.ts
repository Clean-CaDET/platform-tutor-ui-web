import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {UnitService} from '../unit/unit.service';
import {KnowledgeComponent} from './model/knowledge-component.model';
import {LearningObject} from '../learning-objects/learning-object.model';

@Component({
  selector: 'cc-knowledge-component',
  templateUrl: './knowledge-component.component.html',
  styleUrls: ['./knowledge-component.component.css']
})
export class KnowledgeComponentComponent implements OnInit {
  knowledgeComponent: KnowledgeComponent;
  learningObjects: LearningObject[];
  sidenavOpened = false;
  instructionalItemsShown = true;
  unitId: number;

  constructor(
    private route: ActivatedRoute,
    private unitService: UnitService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (this.knowledgeComponent)
        this.unitService.terminateSession(this.knowledgeComponent.id).subscribe();        
      this.unitService.launchSession(+params.kcId).subscribe(() => {
        this.getKnowledgeComponent(+params.kcId);
        this.unitId = +params.unitId;
      });
    });
  }

  ngOnDestroy(): void {
    this.unitService.terminateSession(this.knowledgeComponent.id).subscribe();
  }

  nextPage(page: string): void {
    if (page === 'AE') {
      this.onAssessmentItemClicked();
    } else if (page === 'IE') {
      this.onInstructionalItemsClicked();
    }
  }

  private getKnowledgeComponent(kcId: number): void {
    this.unitService.getKnowledgeComponent(kcId).subscribe(kc => {
      this.knowledgeComponent = kc;
      this.onInstructionalItemsClicked();
    });
  }

  onInstructionalItemsClicked(): void {
    this.unitService.getInstructionalItems(this.knowledgeComponent.id).subscribe(instructionalItems => {
      this.instructionalItemsShown = true;
      this.learningObjects = instructionalItems;
      this.scrollToTop();
    });
  }

  onAssessmentItemClicked(): void {
    this.unitService.getSuitableAssessmentItem(this.knowledgeComponent.id).subscribe(assessmentItem => {
      this.instructionalItemsShown = false;
      this.learningObjects = [];
      this.learningObjects[0] = assessmentItem;
      this.scrollToTop();
    });
  }

  private scrollToTop() {
    document.querySelector('#router-outlet').scrollTop = 0;
  }
}
