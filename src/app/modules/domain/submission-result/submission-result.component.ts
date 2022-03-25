import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {AeService} from '../knowledge-component/ae.service';
import {UnitService} from '../unit/unit.service';
import {Output, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'cc-submission-result',
  templateUrl: './submission-result.component.html',
  styleUrls: ['./submission-result.component.scss']
})
export class SubmissionResultComponent implements OnInit, OnDestroy {

  @Input() kcId: number;
  @Output() nextPageEvent = new EventEmitter<string>();
  @Output() emotionDialogEvent = new EventEmitter<boolean>();
  correctness = -1;
  mastery: number;
  totalCount: number;
  completedCount: number;
  attemptedCount: number;
  private subscription: Subscription;

  constructor(private aeService: AeService, private unitService: UnitService) {}

  ngOnInit(): void {
    this.subscription = this.aeService.submitAeEvent.subscribe(value => {
      {
        this.correctness = value;
        this.getKnowledgeComponentStatistics();
      }
    });
    this.getKnowledgeComponentStatistics();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getKnowledgeComponentStatistics(): void {
    this.unitService.getKnowledgeComponentStatistics(this.kcId).subscribe(result => {
      this.mastery = result.mastery;
      this.totalCount = result.totalCount;
      this.completedCount = result.completedCount;
      this.attemptedCount = result.attemptedCount;
      this.emotionDialogEvent.emit(result.isSatisfied);
    });
  }

  nextPage(page: string): void {
    this.correctness = -1;
    this.nextPageEvent.emit(page);
  }
}
