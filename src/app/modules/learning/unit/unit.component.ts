import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TutorImprovementComponent } from './tutor-improvement/tutor-improvement.component';
import { Unit } from '../model/unit.model';
import { UnitService } from './unit.service';
import { KCMastery } from '../model/knowledge-component-mastery.model';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer, Title} from "@angular/platform-browser";
import { TaskService } from '../task/task.service';
import { LearningTask } from '../task/model/learning-task';

@Component({
  selector: 'cc-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
})
export class UnitComponent implements OnInit {
  courseId: number;
  unit: Unit;
  masteries: KCMastery[] = [];
  learningTasks: LearningTask[];
  sidenavOpened = false;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private unitService: UnitService,
    private taskService: TaskService,
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
          this.unit = unit;
          this.title.setTitle("Tutor - " + unit.name);
          this.unit.knowledgeComponents = [];
          this.unitService.getKcsWithMasteries(+params.unitId).subscribe(
            results => {
              results.forEach(
                result => {
                  this.unit.knowledgeComponents.push(result.knowledgeComponent);
                  if(result.mastery) this.masteries.push(result.mastery);
                });
              }
          );
          this.taskService.getByUnit(+params.unitId).subscribe(learningTasks => {
            this.learningTasks = learningTasks;
          });
        });
    });
  }

  openImprovementDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { unitId: this.unit.id };
    this.dialog.open(TutorImprovementComponent, dialogConfig);
  }

  calcKcs(): number {
    return this.masteries?.length;
  }

  calcSatisfiedKcs(): number {
    return this.masteries?.filter(m => m.isSatisfied).length
  }

  displayTaskDescription(text: string): string {
    return text.length > 300 ? text.substring(0, 300) + "..." : text;
  }
}
