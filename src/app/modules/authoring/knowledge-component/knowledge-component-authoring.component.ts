import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { KnowledgeComponent } from '../../learning/model/knowledge-component.model';
import { KnowledgeComponentService } from './knowledge-component-authoring.service';

@Component({
  selector: 'cc-knowledge-component-authoring',
  templateUrl: './knowledge-component-authoring.component.html',
  styleUrls: ['./knowledge-component-authoring.component.scss']
})
export class KnowledgeComponentAuthoringComponent implements OnInit, OnDestroy {
  courseId: number;
  allKcs: KnowledgeComponent[];
  
  kc: KnowledgeComponent;
  nextKc: KnowledgeComponent;
  prevKc: KnowledgeComponent;

  routeSubscription: any;

  constructor(private kcService: KnowledgeComponentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if(!this.allKcs?.length) {
        this.courseId = +params.courseId;
        this.kcService.getByUnit(+params.unitId).subscribe(kcs => {
          this.allKcs = kcs.sort((a, b) => a.order - b.order);
          this.setKcs(+params.kcId);
        });
      } else {
        this.setKcs(+params.kcId);
      }
    });
  }

  private setKcs(activeKcId: number) {
    this.kc = this.allKcs.find(kc => kc.id == activeKcId);
    const index = this.allKcs.findIndex(kc => kc.id == activeKcId);
    this.prevKc = index != 0 ? this.allKcs[index-1] : null;
    this.nextKc = index != this.allKcs.length - 1 ? this.allKcs[index+1] : null;
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
