import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UnitService} from '../unit/unit.service';
import {KnowledgeComponent} from './model/knowledge-component.model';
import {LearningObject} from '../learning-objects/learning-object.model';
import {LearnerService} from '../../learner/learner.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {EmotionsComponent} from '../feedback/emotions/emotions.component';

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
  learnerId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private unitService: UnitService,
    private learnerService: LearnerService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.kcId = +params.kcId;
      this.learnerId = this.learnerService.learner$.value.id;
      this.getKnowledgeComponent();
      this.getInstructionalEvents();
      this.instructionalEventChecked = true;
    });
  }

  openFeedbackDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(EmotionsComponent, dialogConfig);
  }

  onInstructionalEventClicked(): void {
    this.instructionalEventChecked = true;
    this.getInstructionalEvents();
  }

  onAssessmentEventClicked(): void {
    this.instructionalEventChecked = false;
    this.getSuitableAssessmentEvent();
  }

  private getKnowledgeComponent(): void {
    this.unitService.getKnowledgeComponent(this.kcId).subscribe(kc => {
      this.knowledgeComponent = kc;
    });
  }

  private getInstructionalEvents(): void {
    this.unitService.getInstructionalEvents(this.kcId).subscribe(instructionalEvents => {
      this.learningObjects = instructionalEvents;
    });
  }

  private getSuitableAssessmentEvent(): void {
    this.unitService.getSuitableAssessmentEvent(this.kcId, this.learnerId).subscribe(assessmentEvent => {
      this.learningObjects = [];
      this.learningObjects[0] = assessmentEvent;
    });
  }
}
