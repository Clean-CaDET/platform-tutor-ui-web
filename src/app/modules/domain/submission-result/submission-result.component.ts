import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {AeService} from '../knowledge-component/ae.service';
import {UnitService} from '../unit/unit.service';
import {Output, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EmotionsComponent} from '../feedback/emotions/emotions.component';
import {ActivatedRoute, Params, Router} from '@angular/router';

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
  unitId: number;
  isSatisfied: boolean;
  private submitAeEventSubscription: Subscription;
  private openEmotionsFormSubscription: Subscription;

  constructor(private aeService: AeService,
              private unitService: UnitService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.unitId = +params.unitId;
    });
    this.submitAeEventSubscription = this.aeService.submitAeEvent.subscribe(value => {
      {
        this.correctness = value;
        this.getKnowledgeComponentStatistics();
      }
    });
    this.openEmotionsFormSubscription = this.aeService.openEmotionsFormEvent.subscribe(_ => {
      this.openEmotionsDialog();
    });
    this.getKnowledgeComponentStatistics();
  }

  ngOnDestroy(): void {
    this.submitAeEventSubscription.unsubscribe();
    this.openEmotionsFormSubscription.unsubscribe();
  }

  getKnowledgeComponentStatistics(): void {
    this.unitService.getKnowledgeComponentStatistics(this.kcId).subscribe(result => {
      this.mastery = result.mastery;
      this.totalCount = result.totalCount;
      this.completedCount = result.completedCount;
      this.attemptedCount = result.attemptedCount;
      this.emotionDialogEvent.emit(result.isSatisfied);
      this.isSatisfied = result.isSatisfied;
    });
  }

  openEmotionsDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {kcId: this.kcId, unitId: this.unitId};
    this.dialog.open(EmotionsComponent, dialogConfig);
  }

  onUnitClicked(): void {
    this.router.navigate(['/unit', this.unitId]);
  }

  nextPage(page: string): void {
    this.correctness = -1;
    this.nextPageEvent.emit(page);
  }
}
