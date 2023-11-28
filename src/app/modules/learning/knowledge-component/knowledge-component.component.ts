import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LearningObject } from './learning-objects/learning-object.model';
import { KnowledgeComponent } from '../model/knowledge-component.model';
import { KnowledgeComponentService } from './knowledge-component.service';
import { ChatbotModalService } from '../learning-observer/chatbot-modal.service';
import { SessionPauseService } from './session-pause.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { KcRateComponent } from './kc-rate/kc-rate.component';

@Component({
  selector: 'cc-knowledge-component',
  templateUrl: './knowledge-component.component.html',
  styleUrls: ['./knowledge-component.component.css'],
  providers: [SessionPauseService],
})
export class KnowledgeComponentComponent implements OnInit, OnDestroy {
  knowledgeComponent: KnowledgeComponent;
  learningObjects: LearningObject[];
  sidenavOpened = false;
  instructionalItemsShown = true;
  unitId: number;
  courseId: number;

  constructor(
    private route: ActivatedRoute,
    private knowledgeComponentService: KnowledgeComponentService,
    private sessionPauseTracker: SessionPauseService,
    private modalService: ChatbotModalService,
    private ratingDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (this.knowledgeComponent)
        this.knowledgeComponentService
          .terminateSession(this.knowledgeComponent.id)
          .subscribe();
      this.knowledgeComponentService
        .launchSession(+params.kcId)
        .subscribe(() => {
          this.getKnowledgeComponent(+params.kcId);
          this.unitId = +params.unitId;
          this.courseId = +params.courseId;
        });
      this.sessionPauseTracker.start(+params.kcId);
    });
  }

  ngOnDestroy(): void {
    this.knowledgeComponentService
      .terminateSession(this.knowledgeComponent.id)
      .subscribe();
  }

  nextPage(page: string): void {
    if (page === 'AE') {
      this.onAssessmentItemClicked();
    } else if (page === 'IE') {
      this.onInstructionalItemsClicked();
    }
  }

  private getKnowledgeComponent(kcId: number): void {
    this.knowledgeComponentService
      .getKnowledgeComponent(kcId)
      .subscribe((kc) => {
        this.knowledgeComponent = kc;
        this.onInstructionalItemsClicked();
      });
  }

  onInstructionalItemsClicked(): void {
    this.knowledgeComponentService
      .getInstructionalItems(this.knowledgeComponent.id)
      .subscribe((instructionalItems) => {
        this.instructionalItemsShown = true;
        this.learningObjects = instructionalItems;
        this.scrollToTop();
      });
    this.modalService.notify();
  }

  onAssessmentItemClicked(): void {
    this.knowledgeComponentService
      .getSuitableAssessmentItem(this.knowledgeComponent.id)
      .subscribe((assessmentItem) => {
        this.instructionalItemsShown = false;
        this.learningObjects = [];
        this.learningObjects[0] = assessmentItem;
        this.scrollToTop();
      });
    this.modalService.notify();
  }

  rateKc(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.maxHeight = '800px';
    dialogConfig.maxWidth = '350px';
    dialogConfig.data = {
      kcId: this.knowledgeComponent.id,
      unitId: this.unitId,
      courseId: this.courseId,
    };
    this.ratingDialog.open(KcRateComponent, dialogConfig);
  }

  private scrollToTop() {
    document.querySelector('#router-outlet').scrollTop = 0;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    event.preventDefault();
    localStorage.removeItem('IsPaused' + this.knowledgeComponent.id);
    localStorage.removeItem('LastActive' + this.knowledgeComponent.id);
    this.knowledgeComponentService
      .abandonSession(this.knowledgeComponent.id)
      .subscribe();
  }
}
