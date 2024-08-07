import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LearningObject } from './learning-objects/learning-object.model';
import { KnowledgeComponent } from '../model/knowledge-component.model';
import { KnowledgeComponentService } from './knowledge-component.service';
import { SessionPauseService } from './session-pause.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'cc-knowledge-component',
  templateUrl: './knowledge-component.component.html',
  styleUrls: ['./knowledge-component.component.css'],
  providers: [SessionPauseService],
})
export class KnowledgeComponentComponent implements OnInit, OnDestroy {
  knowledgeComponent: KnowledgeComponent;
  learningObjects: LearningObject[];
  
  mode = 'instruction';
  isSatisfied = false;
  unitId: number;
  courseId: number;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private knowledgeComponentService: KnowledgeComponentService,
    private sessionPauseTracker: SessionPauseService,
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
        this.title.setTitle("Tutor - " + kc.name);
        this.onInstructionalItemsClicked();
      });
  }

  onInstructionalItemsClicked(): void {
    this.knowledgeComponentService
      .getInstructionalItems(this.knowledgeComponent.id)
      .subscribe((instructionalItems) => {
        this.mode = "instruction";
        this.learningObjects = instructionalItems;
        this.scrollToTop();
      });

      this.isSatisfied = false;
      this.knowledgeComponentService
        .getKnowledgeComponentStatistics(this.knowledgeComponent.id)
        .subscribe(results => this.isSatisfied = results.isSatisfied);
  }

  onAssessmentItemClicked(): void {
    this.knowledgeComponentService
      .getSuitableAssessmentItem(this.knowledgeComponent.id)
      .subscribe((assessmentItem) => {
        this.mode = "assessment";
        this.learningObjects = [];
        this.learningObjects[0] = assessmentItem;
        this.scrollToTop();
      });
  }

  onReviewAssessmentsClicked(): void {
    this.knowledgeComponentService
      .getAssessmentItems(this.knowledgeComponent.id)
      .subscribe((items) => {
        this.mode = "review";
        this.learningObjects = items;
        this.scrollToTop();
      });
  }

  private scrollToTop() {
    setTimeout(() => { document.querySelector('#scroller').scroll({top: 0})}, 50);
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
