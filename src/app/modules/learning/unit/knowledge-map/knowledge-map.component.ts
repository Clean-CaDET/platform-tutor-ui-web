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

  ngOnChanges() {
    let rootKc = this.knowledgeComponents.find(kc => !kc.parentId);
    this.nodes = [this.createNode(rootKc)];
  }

  createNode(kc: KnowledgeComponent): TreeNode {
    let kcm = this.masteries.find(m => m.knowledgeComponentId == kc.id);

    let node: TreeNode = {
      id: kc.id,
      name: kc.name,
      order: kc.order,
      code: kc.code,
      children: this.createSortedChildren(kc),
      mastery: kcm.mastery,
      isSatisfied: kcm.isSatisfied
    }

    return node;
  }

  private createSortedChildren(kc: KnowledgeComponent): TreeNode[] {
    return this.findKnowledgeSubcomponents(kc.id).map(kc => this.createNode(kc)).sort((kc1, kc2) => kc1.order - kc2.order);
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
  order: number;
  code: string;
  isSatisfied: boolean;
  children: TreeNode[];
}
