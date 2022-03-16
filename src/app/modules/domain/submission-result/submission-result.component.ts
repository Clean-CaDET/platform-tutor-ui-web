import {Component, Input, OnInit} from '@angular/core';
import {AeService} from '../knowledge-component/ae.service';
import {UnitService} from '../unit/unit.service';
import {Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'cc-submission-result',
  templateUrl: './submission-result.component.html',
  styleUrls: ['./submission-result.component.scss']
})
export class SubmissionResultComponent implements OnInit {

  @Input() correctness: number;
  @Input() kcId: number;
  @Input() mastery: number;
  @Output() nextPageEvent = new EventEmitter<string>();
  @Output() emotionDialogEvent = new EventEmitter<number>();

  constructor(private aeService: AeService, private unitService: UnitService) {
    this.aeService.submitAeEvent.subscribe(value => {
      {
        this.correctness = value;
      }
    });
  }

  ngOnInit(): void {
    this.unitService.getKnowledgeComponentMastery(this.kcId).subscribe(result => {
      this.mastery = result.mastery;
      this.emotionDialogEvent.emit(this.mastery);
    });
  }

  nextPage(page: string): void {
    this.nextPageEvent.emit(page);
  }
}
