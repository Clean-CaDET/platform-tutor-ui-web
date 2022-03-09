import {Component, Input, OnInit} from '@angular/core';
import {KnowledgeComponentService} from '../knowledge-component/knowledge-component.service';
import {UnitService} from '../unit/unit.service';

@Component({
  selector: 'cc-submission-result',
  templateUrl: './submission-result.component.html',
  styleUrls: ['./submission-result.component.scss']
})
export class SubmissionResultComponent implements OnInit {

  @Input() correctness: number;
  @Input() kcId: number;
  @Input() mastery: number;

  constructor(private knowledgeComponentService: KnowledgeComponentService, private unitService: UnitService) {
    this.knowledgeComponentService.submitEvent.subscribe(value => {
      {
        this.correctness = value;
      }
    });
  }

  ngOnInit(): void {
    this.unitService.getKnowledgeComponentMastery(this.kcId).subscribe(result => this.mastery = result.mastery);
  }

  nextAE(): void {
    this.knowledgeComponentService.nextPage('AE');
  }

  backToIE(): void {
    this.knowledgeComponentService.nextPage('IE');
  }

}
