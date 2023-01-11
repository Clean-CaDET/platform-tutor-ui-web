import { Component, OnInit } from '@angular/core';
import { LearningObject } from '../../learning/knowledge-component/learning-objects/learning-object.model';
import { KnowledgeComponent } from '../../learning/model/knowledge-component.model';

@Component({
  selector: 'cc-instructional-items',
  templateUrl: './instructional-items.component.html',
  styleUrls: ['./instructional-items.component.scss']
})
export class InstructionalItemsComponent implements OnInit {
  kc: KnowledgeComponent;
  instructionalItems: LearningObject[];

  constructor() { }

  ngOnInit(): void {}


}
