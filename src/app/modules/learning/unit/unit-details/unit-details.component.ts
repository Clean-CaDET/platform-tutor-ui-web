import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Unit } from '../../model/unit.model';
import { LearningTask } from '../../task/model/learning-task';
import { TaskService } from '../../task/task.service';
import { TutorImprovementComponent } from '../tutor-improvement/tutor-improvement.component';
import { UnitService } from '../unit.service';
import { forkJoin } from 'rxjs';
import { KcWithMastery } from '../../model/kc-with-mastery.model';
import { UnitItem } from '../../model/unit-item.model';

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
    private route: ActivatedRoute, private title: Title,
    private unitService: UnitService, private taskService: TaskService,
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
            this.taskService.getByUnit(+params.unitId)
          ]).subscribe({
            next: ([kcResults, taskResults]) => {
              this.createUnitItems(kcResults, taskResults);
              this.checkErrors();
            },
            error: (error) => {
              this.error = "Sadržaj nije ispravno dobavljen.";
              console.log(error);
            }
          });
        });
    });
  }
  
  private createUnitItems(kcResults: KcWithMastery[], taskResults: LearningTask[]) {
    kcResults.forEach(kcResult => {
      this.unitItems.push({
        order: kcResult.knowledgeComponent.order,
        isKc: true,
        isSatisfied: kcResult.mastery.isSatisfied,
        isNext: false,
        kc: kcResult.knowledgeComponent,
        kcMastery: kcResult.mastery
      });
    });
    taskResults.forEach(taskResult => {
      this.unitItems.push({
        order: taskResult.order,
        isKc: false,
        isNext: false,
        isSatisfied: false,
        task: taskResult
      });
    })

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

  openImprovementDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { unitId: this.unit.id };
    this.dialog.open(TutorImprovementComponent, dialogConfig);
  }
}
