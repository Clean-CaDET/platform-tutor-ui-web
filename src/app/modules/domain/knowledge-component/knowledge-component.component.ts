import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {UnitService} from '../unit/unit.service';
import {KnowledgeComponent} from './model/knowledge-component.model';
import {LearningObject} from '../learning-objects/learning-object.model';
import {LearnerService} from '../../learner/learner.service';

@Component({
  selector: 'cc-knowledge-component',
  templateUrl: './knowledge-component.component.html',
  styleUrls: ['./knowledge-component.component.css']
})
export class KnowledgeComponentComponent implements OnInit {
  knowledgeComponent: KnowledgeComponent;
  learningObjects: LearningObject[];
  sidenavOpened = false;
  instructionalEventChecked = true;
  learnerId: number;
  unitId: number;

  constructor(
    private route: ActivatedRoute,
    private unitService: UnitService,
    private learnerService: LearnerService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.learnerId = this.learnerService.learner$.value.id;
      this.getKnowledgeComponent(+params.kcId);
      this.unitId = +params.unitId;
    });
  }

  nextPage(page: string): void {
    if (page === 'AE') {
      this.onAssessmentEventClicked();
    } else if (page === 'IE') {
      this.onInstructionalEventClicked();
    }
  }

  private getKnowledgeComponent(kcId: number): void {
    this.unitService.getKnowledgeComponent(kcId).subscribe(kc => {
      this.knowledgeComponent = kc;
      this.onInstructionalEventClicked();
    });
  }

  onInstructionalEventClicked(): void {
    this.instructionalEventChecked = true;
    this.unitService.getInstructionalEvents(this.knowledgeComponent.id).subscribe(instructionalEvents => {
      this.learningObjects = instructionalEvents;
    });
  }

  onAssessmentEventClicked(): void {
    this.instructionalEventChecked = false;
    this.unitService.getSuitableAssessmentEvent(this.knowledgeComponent.id, this.learnerId).subscribe(assessmentEvent => {
      this.learningObjects = [];
      this.learningObjects[0] = assessmentEvent;
    });
  }
}
