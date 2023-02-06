import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AssessmentFeedbackConnector } from '../assessment-feedback-connector.service';
import { Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { KnowledgeComponentService } from '../knowledge-component.service';
import { Feedback } from '../../model/learning-objects/feedback.model';

@Component({
  selector: 'cc-submission-result',
  templateUrl: './submission-result.component.html',
  styleUrls: ['./submission-result.component.scss'],
})
export class SubmissionResultComponent implements OnInit, OnDestroy {
  @Input() kcId: number;
  @Output() nextPageEvent = new EventEmitter<string>();
  feedback: Feedback;
  mastery: number;
  totalCount: number;
  passedCount: number;
  attemptedCount: number;
  unitId: number;
  courseId: number;
  isSatisfied: boolean;
  private observedAssessment: Subscription;

  constructor(private assessmentConnector: AssessmentFeedbackConnector, private kcService: KnowledgeComponentService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.unitId = +params.unitId;
      this.courseId = +params.courseId;
    });
    this.observedAssessment = this.assessmentConnector.observedAssessment.subscribe(feedback => {
      this.feedback = feedback;
      this.getKnowledgeComponentStatistics();
    });
    this.getKnowledgeComponentStatistics();
  }

  ngOnDestroy(): void {
    this.observedAssessment?.unsubscribe();
  }

  getKnowledgeComponentStatistics(): void {
    this.kcService.getKnowledgeComponentStatistics(this.kcId).subscribe(result => {
      this.mastery = result.mastery;
      this.totalCount = result.totalCount;
      this.passedCount = result.passedCount;
      this.attemptedCount = result.attemptedCount;
      this.isSatisfied = result.isSatisfied;

      if(this.feedback) {
        this.prepareFeedback();
      }
    });
  }
  
  prepareFeedback() {
    console.log('Method not implemented.');
  }

  nextPage(page: string): void {
    this.feedback = null;
    this.nextPageEvent.emit(page);
  }
}
