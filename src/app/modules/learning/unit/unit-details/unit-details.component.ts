import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Unit } from '../../model/unit.model';
import { TaskService } from '../../task/task.service';
import { UnitService } from '../unit.service';
import { forkJoin } from 'rxjs';
import { KcWithMastery } from '../../model/kc-with-mastery.model';
import { UnitItem, UnitItemType } from '../../model/unit-item.model';
import { UnitProgressRatingComponent } from '../unit-progress-rating/unit-progress-rating.component';
import { UnitProgressRatingService } from '../unit-progress-rating/unit-progress-rating.service';
import { UnitFeedbackRequest } from '../../model/unit-feedback-request.model';
import { TaskProgressSummary } from '../../model/task-progress-summary';
import { ReflectionService } from '../../reflection/reflection.service';
import { Reflection } from '../../reflection/reflection.model';

@Component({
  selector: 'cc-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss']
})
export class UnitDetailsComponent implements OnInit {
  courseId: number;
  unit: Unit;

  unitItems: UnitItem[];
  percentMastered: number;
  error: string;

  constructor(
    private route: ActivatedRoute, private title: Title, private unitService: UnitService,
    private taskService: TaskService, private reflectionService: ReflectionService, private ratingService: UnitProgressRatingService,
    private dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "medal",
       sanitizer.bypassSecurityTrustResourceUrl("../../../../assets/icons/medal.svg")
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.courseId = +params.courseId;
      this.unitService.getUnit(this.courseId, +params.unitId).subscribe(
        unit => {
          this.error = null;
          this.unit = unit;
          this.title.setTitle("Tutor - " + unit.name);
          this.unitItems = [];

          forkJoin([
            this.unitService.getKcsWithMasteries(+params.unitId),
            this.taskService.getByUnit(+params.unitId),
            this.reflectionService.getByUnit(+params.unitId)
          ]).subscribe({
            next: ([kcResults, taskResults, reflections]) => {
              this.createUnitItems(kcResults, taskResults, reflections);
              this.checkErrors();
              this.checkFeedbackCollection();
            },
            error: (error) => {
              this.error = "Sadržaj nije ispravno dobavljen.";
              console.log(error);
            }
          });
        });
    });
  }

  private createUnitItems(kcResults: KcWithMastery[], taskResults: TaskProgressSummary[], reflections: Reflection[]) {
    kcResults.forEach(kcResult => {
      this.unitItems.push({
        id: kcResult.knowledgeComponent.id,
        order: kcResult.knowledgeComponent.order,
        name: kcResult.knowledgeComponent.name,
        type: UnitItemType.Kc,
        isSatisfied: kcResult.mastery.isSatisfied,
        isNext: false,
        kc: kcResult.knowledgeComponent,
        kcMastery: kcResult.mastery
      });
    });
    taskResults.forEach(taskResult => {
      this.unitItems.push({
        id: taskResult.id,
        order: taskResult.order,
        name: taskResult.name,
        type: UnitItemType.Task,
        isNext: false,
        isSatisfied: taskResult.status == 'Completed' || taskResult.status == 'Graded',
        task: taskResult
      });
    });
    reflections.forEach(reflection => {
      this.unitItems.push({
        id: reflection.id,
        order: reflection.order,
        name: reflection.name,
        type: UnitItemType.Reflection,
        isNext: false,
        isSatisfied: reflection.submissions?.length > 0
      });
    });

    this.unitItems.sort((a, b) => a.order - b.order);
    const firstUnsatisfied = this.unitItems.find(i => !i.isSatisfied);
    if(firstUnsatisfied) firstUnsatisfied.isNext = true;
    const satisfiedCount = this.unitItems.filter(i => i.isSatisfied).length;
    this.percentMastered = Math.round(100 * satisfiedCount / this.unitItems.length);
  }

  private checkErrors() {
    if(this.unitItems?.length === 0) {
      this.error = "Lekcija nema sadržaj.";
    }
  }

  private checkFeedbackCollection() {
    this.ratingService.shouldRequestFeedback(this.unit.id).subscribe(feedbackRequest => {
      if(!feedbackRequest.requestKcFeedback && !feedbackRequest.requestTaskFeedback) return;
      this.rateProgress(feedbackRequest, false);
    });
  }

  rateProgress(feedbackRequested: UnitFeedbackRequest, isLearnerInitiated: boolean, itemId: number = 0): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.enterAnimationDuration = 500;
    dialogConfig.data = this.createDialogData(feedbackRequested, isLearnerInitiated, itemId);
    this.dialog.open(UnitProgressRatingComponent, dialogConfig);
  }

  private createDialogData(feedbackRequested: UnitFeedbackRequest, isLearnerInitiated: boolean, itemId: number) {
    if(isLearnerInitiated) {
      return {
        unitId: this.unit.id,
        completedKcIds: feedbackRequested.requestKcFeedback ? [itemId] : [],
        completedTaskIds: feedbackRequested.requestTaskFeedback ? [itemId] : [],
        kcFeedback: feedbackRequested.requestKcFeedback,
        taskFeedback: feedbackRequested.requestTaskFeedback,
        isLearnerInitiated: true
      };
    }
    return {
      unitId: this.unit.id,
      completedKcIds: this.unitItems.filter(i => i.type === UnitItemType.Kc && i.isSatisfied).map(i => i.kc.id),
      completedTaskIds: this.unitItems.filter(i => i.type === UnitItemType.Task && i.isSatisfied).map(i => i.task.id),
      kcFeedback: feedbackRequested.requestKcFeedback,
      taskFeedback: feedbackRequested.requestTaskFeedback,
      isLearnerInitiated: false
    };
  }
}
