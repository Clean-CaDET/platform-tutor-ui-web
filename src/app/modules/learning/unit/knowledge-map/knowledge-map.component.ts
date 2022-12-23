import { Component, Input } from '@angular/core';
import { KnowledgeComponent } from '../../model/knowledge-component.model';

@Component({
  selector: 'cc-knowledge-map',
  templateUrl: './knowledge-map.component.html',
  styleUrls: ['./knowledge-map.component.scss'],
})
export class KnowledgeMapComponent {
  @Input() knowledgeComponents: KnowledgeComponent[];
  @Input() level = 0;
  @Input() expanded = false;
  @Input() unitId: number;

  constructor() {}

  isLocked(kc: KnowledgeComponent): boolean {
    return this.areChildrenIncomplete(kc.knowledgeComponents);
  }

  isCompleted(kc: KnowledgeComponent): boolean {
    return (
      !this.areChildrenIncomplete(kc.knowledgeComponents) &&
      kc.mastery.isSatisfied
    );
  }

  isInProgress(kc: KnowledgeComponent): boolean {
    return (
      !this.areChildrenIncomplete(kc.knowledgeComponents) &&
      !kc.mastery.isSatisfied
    );
  }

  private areChildrenIncomplete(childrenKCs: KnowledgeComponent[]): boolean {
    return childrenKCs.some((kc) => !kc.mastery.isSatisfied);
  }
}
