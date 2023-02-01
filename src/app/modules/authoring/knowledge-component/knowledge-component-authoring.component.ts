import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { KnowledgeComponent } from '../../learning/model/knowledge-component.model';
import { KnowledgeComponentService } from './knowledge-component-authoring.service';

@Component({
  selector: 'cc-knowledge-component-authoring',
  templateUrl: './knowledge-component-authoring.component.html',
  styleUrls: ['./knowledge-component-authoring.component.scss']
})
export class KnowledgeComponentAuthoringComponent implements OnInit {
  courseId: number;
  kc: KnowledgeComponent;

  constructor(private kcService: KnowledgeComponentService, private route: ActivatedRoute) { }
  // Should be reworked to integrate this small component into instructional items.
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.kcService.get(+params.kcId).subscribe(kc => {
        this.kc = kc;
      });
    });
  }

  editKc(): void {

  }
}
