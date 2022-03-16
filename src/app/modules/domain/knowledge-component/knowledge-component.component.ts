import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UnitService} from '../unit/unit.service';
import {KnowledgeComponent} from './model/knowledge-component.model';
import {LearningObject} from '../learning-objects/learning-object.model';
import {LearnerService} from '../../learner/learner.service';
import {AeService} from './ae.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {EmotionsComponent} from '../feedback/emotions/emotions.component';
import {EmotionsService} from '../feedback/emotions/emotions.service';

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
  kcId: number;
  learnerId: number;
  kcm: number;
  aeCorrectnessLevel: number;
  aeSubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private unitService: UnitService,
    private learnerService: LearnerService,
    private aeService: AeService,
    private dialog: MatDialog) {
    this.registerEventListeners();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.kcId = +params.kcId;
      this.learnerId = this.learnerService.learner$.value.id;
      this.getKnowledgeComponent();
      this.getInstructionalEvents();
      this.instructionalEventChecked = true;
      this.aeSubmitted = false;
      this.aeCorrectnessLevel = 0.0;
    });
  }

  nextPage(page: string): void {
    this.aeCorrectnessLevel = 0.0;
    this.aeSubmitted = false;
    if (page === 'AE') {
      this.onAssessmentEventClicked();
    } else if (page === 'IE') {
      this.onInstructionalEventClicked();
    }
  }

  updateKCM(mastery: number): void {
    this.kcm = mastery;
    if (this.kcm >= 0.9) {
      this.openEmotionsDialog();
    }
  }

  openEmotionsDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {kcId: this.kcId};
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

  private registerEventListeners(): void {
    this.aeService.submitAeEvent.subscribe(value => {
      {
        this.aeCorrectnessLevel = value;
        this.aeSubmitted = true;
      }
    });
  }
}
