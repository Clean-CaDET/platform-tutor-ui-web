import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {InterfacingInstructor} from '../../instructor/interfacing-instructor.service';
import {UnitService} from '../unit/unit.service';
import {Output, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EmotionsComponent} from '../feedback/emotions/emotions.component';
import {ActivatedRoute, Params} from '@angular/router';

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
  passedCount: number;
  attemptedCount: number;
  unitId: number;
  isSatisfied: boolean;
  private observedAeEvaluations: Subscription;
  private openEmotionsFormSubscription: Subscription;

  constructor(private instructor: InterfacingInstructor,
              private unitService: UnitService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.unitId = +params.unitId;
    });
    this.observedAeEvaluations = this.instructor.observedAeEvaluations.subscribe(value => {
      {
        this.correctness = value;
        this.getKnowledgeComponentStatistics();
      }
    });
    this.openEmotionsFormSubscription = this.instructor.openEmotionsFormEvent.subscribe(_ => {
      this.openEmotionsDialog();
    });
    this.getKnowledgeComponentStatistics();
  }

  ngOnDestroy(): void {
    this.observedAeEvaluations?.unsubscribe();
    this.openEmotionsFormSubscription?.unsubscribe();
  }

  getKnowledgeComponentStatistics(): void {
    this.unitService.getKnowledgeComponentStatistics(this.kcId).subscribe(result => {
      this.mastery = result.mastery;
      this.totalCount = result.totalCount;
      this.passedCount = result.passedCount;
      this.attemptedCount = result.attemptedCount;
      this.emotionDialogEvent.emit(result.isSatisfied);
      this.isSatisfied = result.isSatisfied;
    });
  }

  //TODO: This belongs to the interfacing instructor, but that service is growing into a god class.
  //We should consider how to decompose the interfacing instructor
  openEmotionsDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {kcId: this.kcId, unitId: this.unitId};
    this.dialog.open(EmotionsComponent, dialogConfig);
  }

  nextPage(page: string): void {
    this.correctness = -1;
    this.nextPageEvent.emit(page);
  }
}
