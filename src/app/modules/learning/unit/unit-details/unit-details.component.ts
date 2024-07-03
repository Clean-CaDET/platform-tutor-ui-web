import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { KCMastery } from '../../model/knowledge-component-mastery.model';
import { Unit } from '../../model/unit.model';
import { LearningTask } from '../../task/model/learning-task';
import { TaskService } from '../../task/task.service';
import { TutorImprovementComponent } from '../tutor-improvement/tutor-improvement.component';
import { UnitService } from '../unit.service';

@Component({
  selector: 'cc-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss']
})
export class UnitDetailsComponent implements OnInit {
  courseId: number;
  unit: Unit;
  masteries: KCMastery[] = [];
  satisfiedMasteriesCount: number;
  learningTasks: LearningTask[];

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
          this.unitService.getKcsWithMasteries(+params.unitId).subscribe(results => {
            results.forEach(result => {
              this.unit.knowledgeComponents.push(result.knowledgeComponent);
              if(result.mastery) this.masteries.push(result.mastery);
            });
            this.satisfiedMasteriesCount = this.masteries.filter(m => m.isSatisfied).length;
          });
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

  displayTaskDescription(text: string): string {
    return text.length > 300 ? text.substring(0, 300) + "..." : text;
  }
}
