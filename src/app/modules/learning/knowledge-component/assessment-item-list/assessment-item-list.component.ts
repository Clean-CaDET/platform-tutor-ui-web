import { Component, Input } from '@angular/core';
import { LearningObject } from '../learning-objects/learning-object.model';

@Component({
  selector: 'cc-assessment-item-list',
  templateUrl: './assessment-item-list.component.html',
  styleUrl: './assessment-item-list.component.scss'
})
export class AssessmentItemListComponent {
  @Input() courseId: number;
  @Input() unitId: number;
  @Input() kcId: number;
  
  @Input() items: LearningObject[];
  showAnswer = {};
}
