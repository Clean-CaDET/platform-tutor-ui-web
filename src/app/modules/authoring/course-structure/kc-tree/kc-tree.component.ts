import { Component, Input, OnChanges } from '@angular/core';
import { KnowledgeComponent } from 'src/app/modules/learning/model/knowledge-component.model';
import { Unit } from 'src/app/modules/learning/model/unit.model';

@Component({
  selector: 'cc-kc-tree',
  templateUrl: './kc-tree.component.html',
  styleUrls: ['./kc-tree.component.scss']
})
export class KcTreeComponent implements OnChanges {
  @Input() unit: Unit;
  nodes: TreeNode[];

  constructor() {}

  ngOnChanges() {
    if(this.unit) {
        this.nodes = this.createTree(this.unit.knowledgeComponents);
    }
  }

  createTree(knowledgeComponents: KnowledgeComponent[]): TreeNode[] {
    let nodes = new Array();
    knowledgeComponents.forEach(element => {
        let node: TreeNode = {
            id: element.code + ': ' + element.name,
            children: this.createTree(element.knowledgeComponents),
            isExpanded: true
        }
        nodes.push(node);
    });
    return nodes;
  }
}

interface TreeNode {
  id: string;
  children: TreeNode[];
  isExpanded?:boolean;
}