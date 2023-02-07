import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AssessmentFeedbackConnector } from '../assessment-feedback-connector.service';
import { Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { KnowledgeComponentService } from '../knowledge-component.service';
import { Feedback, feedbackTypes } from '../../model/learning-objects/feedback.model';
import { KnowledgeComponentStatistics } from '../../model/knowledge-component-statistics.model';
import { createResponse } from './feedback-message-creator';

@Component({
  selector: 'cc-submission-result',
  templateUrl: './submission-result.component.html',
  styleUrls: ['./submission-result.component.scss'],
})
export class SubmissionResultComponent implements OnInit, OnDestroy {
  @Input() kcId: number;
  courseId: number;
  unitId: number;

  @Output() changePage = new EventEmitter<string>();
  private observedAssessment: Subscription;

  statistics: KnowledgeComponentStatistics;
  feedbackMessage: string;
  feedbackProcessed: boolean;

  constructor(private assessmentConnector: AssessmentFeedbackConnector, private kcService: KnowledgeComponentService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.unitId = +params.unitId;
      this.courseId = +params.courseId;
    });
    this.observedAssessment = this.assessmentConnector.observedAssessment.subscribe(feedback => {
      this.getKnowledgeComponentStatistics(feedback);
    });
    this.getKnowledgeComponentStatistics(null);
  }

  ngOnDestroy(): void {
    this.observedAssessment?.unsubscribe();
  }

  getKnowledgeComponentStatistics(feedback: Feedback): void {
    this.feedbackProcessed = false;
    this.feedbackMessage = "";
    this.kcService.getKnowledgeComponentStatistics(this.kcId).subscribe(result => {
      if(feedback) {
        let isFirstSatisfaction = this.statistics.isSatisfied !== result.isSatisfied
        this.processFeedback(feedback, isFirstSatisfaction);
      }
      this.statistics = result;
    });
  }

  private processFeedback(feedback: Feedback, isFirstSatisfaction: boolean) {
    this.feedbackMessage = createResponse(feedback, isFirstSatisfaction);
    this.feedbackProcessed = true;
    setTimeout(() => {
      if(feedback.type === feedbackTypes.solution) this.assessmentConnector.sendToAssessment(feedback);
    }, 1000);
  }

  onChangePage(page: string): void {
    this.feedbackProcessed = false;
    this.feedbackMessage = "";
    this.changePage.emit(page);
  }
}
