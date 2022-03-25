import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {UnitService} from '../unit/unit.service';
import {KnowledgeComponent} from './model/knowledge-component.model';
import {LearningObject} from '../learning-objects/learning-object.model';
import {LearnerService} from '../../learner/learner.service';
import {AeService} from './ae.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EmotionsComponent} from '../feedback/emotions/emotions.component';
import {Subject} from 'rxjs';

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
    private learnerService: LearnerService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.learnerId = this.learnerService.learner$.value.id;
      this.getKnowledgeComponent(+params.kcId);
      this.unitId = +params.currentUnitId;
    });
  }

  nextPage(page: string): void {
    if (page === 'AE') {
      this.onAssessmentEventClicked();
    } else if (page === 'IE') {
      this.onInstructionalEventClicked();
    }
  }

  updateKCM(isSatisfied: boolean): void {
    if (isSatisfied) {
      this.openEmotionsDialog();
    }
  }

  openEmotionsDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {kcId: this.knowledgeComponent.id, unitId: this.unitId};
    this.dialog.open(EmotionsComponent, dialogConfig);
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
