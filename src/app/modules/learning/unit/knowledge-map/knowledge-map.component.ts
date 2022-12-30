import { Component, Input, OnChanges } from '@angular/core';
import { KCMastery } from '../../model/knowledge-component-mastery.model';
import { KnowledgeComponent } from '../../model/knowledge-component.model';

@Component({
  selector: 'cc-knowledge-map',
  templateUrl: './knowledge-map.component.html',
  styleUrls: ['./knowledge-map.component.scss'],
})
export class KnowledgeMapComponent implements OnChanges {
  @Input() knowledgeComponents: KnowledgeComponent[];
  @Input() masteries: KCMastery[];
  nodes: TreeNode[] = [];
 
  constructor() {}

  ngOnChanges() {
    let rootKc = this.knowledgeComponents.find(kc => !kc.parentId);
    this.nodes.push(this.createNode(rootKc));
  }

  createNode(kc: KnowledgeComponent): TreeNode {
    let kcm = this.masteries.find(m => m.knowledgeComponentId == kc.id);
    
    let node: TreeNode = {
      id: kc.id,
      name: kc.name,
      children: this.findKnowledgeSubcomponents(kc.id).map(kc => this.createNode(kc)),
      mastery: kcm.mastery,
      isSatisfied: kcm.isSatisfied
    }

    return node;
  }

  findKnowledgeSubcomponents(parentId: number): KnowledgeComponent[] {
    return this.knowledgeComponents.filter(kc => kc.parentId === parentId);
  }

  isLocked(node: TreeNode): boolean {
    return this.areChildrenIncomplete(node.children);
  }

  isCompleted(node: TreeNode): boolean {
    return (
      !this.areChildrenIncomplete(node.children) &&
      node.isSatisfied
    );
  }

  isInProgress(node: TreeNode): boolean {
    return (
      !this.areChildrenIncomplete(node.children) &&
      !node.isSatisfied
    );
  }

  private areChildrenIncomplete(children: TreeNode[]): boolean {
    return children.some((node) => !node.isSatisfied);
  }
}

interface TreeNode {
  id: number;
  name: string;
  mastery: number;
  isSatisfied: boolean;
  children: TreeNode[];
}