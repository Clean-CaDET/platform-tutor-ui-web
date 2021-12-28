import {Component, EventEmitter, Input, Output} from '@angular/core';
import {KnowledgeComponent} from '../knowledge-component/model/knowledge-component.model';

@Component({
  selector: 'cc-knowledge-map',
  templateUrl: './knowledge-map.component.html',
  styleUrls: ['./knowledge-map.component.scss']
})
export class KnowledgeMapComponent {
  @Input() knowledgeComponents: KnowledgeComponent[];
  @Input() level = 0;
  @Output() selectedKC = new EventEmitter<KnowledgeComponent>();

  constructor() { }
}
