import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LearningObject } from '../../learning/knowledge-component/learning-objects/learning-object.model';
import { KnowledgeComponent } from '../../learning/model/knowledge-component.model';
import { KnowledgeComponentService } from '../course-structure/kc-tree/knowledge-component.service';

@Component({
  selector: 'cc-instructional-items',
  templateUrl: './instructional-items.component.html',
  styleUrls: ['./instructional-items.component.scss']
})
export class InstructionalItemsComponent implements OnInit {
  courseId: number;
  kc: KnowledgeComponent;
  instructionalItems: LearningObject[];

  constructor(private kcService: KnowledgeComponentService, private route: ActivatedRoute) { }

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
