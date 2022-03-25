import {Component, Input, OnInit} from '@angular/core';
import {AeService} from '../knowledge-component/ae.service';
import {UnitService} from '../unit/unit.service';
import {Output, EventEmitter} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'cc-submission-result',
  templateUrl: './submission-result.component.html',
  styleUrls: ['./submission-result.component.scss']
})
export class SubmissionResultComponent implements OnInit {

  @Input() correctness: number;
  @Input() kcId: number;
  @Output() nextPageEvent = new EventEmitter<string>();
  @Output() emotionDialogEvent = new EventEmitter<boolean>();
  mastery: number;
  totalCount: number;
  completedCount: number;
  attemptedCount: number;
  @Input() aeSubmittedEvent: Observable<void>;
  private eventsSubscription: Subscription;

  constructor(private aeService: AeService, private unitService: UnitService) {
    this.aeService.submitAeEvent.subscribe(value => {
      {
        this.correctness = value;
      }
    });
  }

  ngOnInit(): void {
    this.eventsSubscription = this.aeSubmittedEvent.subscribe(() =>
      this.getKnowledgeComponentStatistics());
    this.getKnowledgeComponentStatistics();
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
    this.nextPageEvent.emit(page);
  }
}
