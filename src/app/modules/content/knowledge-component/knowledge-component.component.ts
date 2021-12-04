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
  instructionalEvents: LearningObject[];
  sidenavOpened = false;
  previousPage: { type: string; id: number; };
  nextPage: { type: string; id: number; };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private unitService: UnitService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const kcId = +params.kcId;
      this.getKnowledgeComponent(kcId);
      this.getInstructionalEvents(kcId);
//      this.createPrevAndNextButtons(kcId);
    });
  }

  private getKnowledgeComponent(kcId: number): void {
    this.unitService.getKnowledgeComponent(kcId).subscribe(kc => {
      this.knowledgeComponent = kc;
      console.log(this.knowledgeComponent.name);
    });
  }

  private getInstructionalEvents(kcId: number): void {
    this.unitService.getInstructionalEvents(kcId).subscribe(instructionalEvents => {
      this.instructionalEvents = instructionalEvents;
    });
  }

  private getAssessmentEvents(kcId: number): void {
    this.unitService.getInstructionalEvents(kcId).subscribe(instructionalEvents => {
      this.instructionalEvents = instructionalEvents;
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
