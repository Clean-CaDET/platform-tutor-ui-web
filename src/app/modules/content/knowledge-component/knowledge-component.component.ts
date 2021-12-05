import {Component, OnInit} from '@angular/core';
import {KnowledgeNode} from '../knowledge-node/model/knowledge-node.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LectureService} from '../lecture/lecture.service';
import {UnitService} from '../unit/unit.service';
import {KnowledgeComponent} from './model/knowledge-component.model';
import {LearningObject} from '../learning-objects/model/learning-object.model';

@Component({
  selector: 'cc-knowledge-component',
  templateUrl: './knowledge-component.component.html',
  styleUrls: ['./knowledge-component.component.css']
})
export class KnowledgeComponentComponent implements OnInit {

  knowledgeComponent: KnowledgeComponent;
  learningObjects: LearningObject[];
  sidenavOpened = false;
  previousPage: { type: string; id: number; };
  nextPage: { type: string; id: number; };
  instructionalEventChecked = true;
  kcId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private unitService: UnitService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.kcId = +params.kcId;
      this.getKnowledgeComponent();
      this.getInstructionalEvents();
//      this.createPrevAndNextButtons(kcId);
    });
  }

  onInstructionalEventClicked(): void {
    this.instructionalEventChecked = true;
    this.getInstructionalEvents();
  }

  onAssessmentEventClicked(): void {
    this.instructionalEventChecked = false;
    this.getAssessmentEvents();
  }

  private getKnowledgeComponent(): void {
    this.unitService.getKnowledgeComponent(this.kcId).subscribe(kc => {
      this.knowledgeComponent = kc;
      console.log(this.knowledgeComponent.name);
    });
  }

  private getInstructionalEvents(): void {
    this.unitService.getInstructionalEvents(this.kcId).subscribe(instructionalEvents => {
      this.learningObjects = instructionalEvents;
    });
  }

  private getAssessmentEvents(): void {
    this.unitService.getAssessmentEvents(this.kcId).subscribe(assessmentEvents => {
      this.learningObjects = assessmentEvents;
    });
  }

  // private createPrevAndNextButtons(kcId: number): void {
  //   this.previousPage = null;
  //   this.nextPage = null;
  //   this.unitService.getUnits().subscribe(units => {
  //     const unit = units.find(u => u.knowledgeComponents.includes(this.knowledgeComponent));
  //     const kcIndex = unit.knowledgeComponents.indexOf(this.knowledgeComponent);
  //
  //     if (kcIndex > 0) {
  //       this.previousPage = {
  //         type: 'node',
  //         id: unit.knowledgeComponents[kcIndex - 1].id
  //       };
  //     } else {
  //       const previousLectureIndex = units.indexOf(unit) - 1;
  //       if (previousLectureIndex >= 0) {
  //         this.previousPage = {
  //           type: 'lecture',
  //           id: units[previousLectureIndex].id
  //         };
  //       }
  //     }
  //
  //     if (kcIndex < unit.knowledgeComponents.length - 1) {
  //       this.nextPage = {
  //         type: 'node',
  //         id: unit.knowledgeComponents[kcIndex + 1].id
  //       };
  //     } else {
  //       const nextLectureIndex = units.indexOf(unit) + 1;
  //       if (nextLectureIndex < units.length) {
  //         this.nextPage = {
  //           type: 'lecture',
  //           id: units[nextLectureIndex].id
  //         };
  //       }
  //     }
  //   });
  // }
  //
  // changePage(url: string): void {
  //   this.knowledgeComponent = null;
  //   this.nextPage = null;
  //   this.previousPage = null;
  //   this.router.navigate([url]);
  // }

}
