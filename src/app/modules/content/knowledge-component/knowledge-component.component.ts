import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UnitService} from '../unit/unit.service';
import {KnowledgeComponent} from './model/knowledge-component.model';
import {LearningObject} from '../learning-objects/model/learning-object.model';

@Component({
  selector: 'cc-knowledge-component',
  templateUrl: './knowledge-component.component.html',
  styleUrls: ['./knowledge-component.component.css']
})
export class KnowledgeComponentComponent implements OnInit {

  knowledgeComponent: KnowledgeComponent;
  learningObjects: LearningObject[];
  sidenavOpened = false;
  nextPage: { type: string; id: number; };
  instructionalEventChecked = true;
  kcId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private unitService: UnitService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.kcId = +params.kcId;
      this.getKnowledgeComponent();
      this.getInstructionalEvents();
    });
  }

  onInstructionalEventClicked(): void {
    this.instructionalEventChecked = true;
    this.getInstructionalEvents();
  }

  onAssessmentEventClicked(): void {
    this.instructionalEventChecked = false;
    this.getAssessmentEvents();
  }

  private getKnowledgeComponent(): void {
    this.unitService.getKnowledgeComponent(this.kcId).subscribe(kc => {
      this.knowledgeComponent = kc;
      console.log(this.knowledgeComponent.name);
    });
  }

  private getInstructionalEvents(): void {
    this.unitService.getInstructionalEvents(this.kcId).subscribe(instructionalEvents => {
      this.learningObjects = instructionalEvents;
    });
  }

  private getAssessmentEvents(): void {
    this.unitService.getAssessmentEvents(this.kcId).subscribe(assessmentEvents => {
      this.learningObjects = assessmentEvents;
    });
  }
}
