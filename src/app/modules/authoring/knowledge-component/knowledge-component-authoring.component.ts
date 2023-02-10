import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { KnowledgeComponent } from '../../learning/model/knowledge-component.model';
import { KnowledgeComponentService } from './knowledge-component-authoring.service';

@Component({
  selector: 'cc-knowledge-component-authoring',
  templateUrl: './knowledge-component-authoring.component.html',
  styleUrls: ['./knowledge-component-authoring.component.scss']
})
export class KnowledgeComponentAuthoringComponent implements OnInit, OnDestroy {
  courseId: number;
  kc: KnowledgeComponent;

  routeSubscription: any;

  constructor(private kcService: KnowledgeComponentService, private route: ActivatedRoute) { }

  // Should be reworked to integrate this small component into instructional items.
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.kcService.get(+params.kcId).subscribe(kc => {
        this.kc = kc;
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
