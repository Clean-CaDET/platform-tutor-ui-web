import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KnowledgeComponent } from 'src/app/modules/learning/model/knowledge-component.model';
import { Unit } from 'src/app/modules/learning/model/unit.model';
import { FormMode, KcFormComponent } from '../kc-form/kc-form.component';

@Component({
  selector: 'cc-kc-tree',
  templateUrl: './kc-tree.component.html',
  styleUrls: ['./kc-tree.component.scss']
})
export class KcTreeComponent implements OnChanges {
  @Input() unit: Unit;

  nodes: TreeNode[];
  allKnowledgeComponents: KnowledgeComponent[];

  constructor(private dialog: MatDialog) {}

  ngOnChanges() {
    if(this.unit) {
      this.nodes = this.createTree(this.unit.knowledgeComponents);
      this.allKnowledgeComponents = this.flattenKCs(this.unit.knowledgeComponents);
    }
  }

  createTree(knowledgeComponents: KnowledgeComponent[]): TreeNode[] {
    let nodes = new Array();
    knowledgeComponents.forEach(element => {
        let node: TreeNode = {
            id: element.id,
            code: element.code,
            name: element.name,
            order: element.order,
            children: this.createTree(element.knowledgeComponents),
            isExpanded: true
        }
        nodes.push(node);
    });
    return nodes;
  }

  flattenKCs(knowledgeComponents: KnowledgeComponent[]): KnowledgeComponent[] {
    let retVal = new Array();
    if(knowledgeComponents) {
      retVal = knowledgeComponents;
      knowledgeComponents.forEach(element => {
        retVal = retVal.concat(this.flattenKCs(element.knowledgeComponents));
      });
    }
    return retVal;
  }

  editKc(id: number): void {
    let kc = this.allKnowledgeComponents.find(kc => kc.id === id);
    
    const dialogRef = this.dialog.open(KcFormComponent, {
      data: {
        knowledgeComponent: kc,
        parentComponentOptions: this.getNonChildComponents(kc),
        formMode: kc.parentId ? FormMode.EditChild : FormMode.EditFirst
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
    });
  }
  
  private getNonChildComponents(kc: KnowledgeComponent): KnowledgeComponent[] {
    let childComponents = this.flattenKCs(kc.knowledgeComponents);
    childComponents.push(kc);
    return this.allKnowledgeComponents.filter(component => !childComponents.includes(component));
  }
}

interface TreeNode {
  id: number;
  code: string;
  name: string;
  order: number;
  children: TreeNode[];
  isExpanded?:boolean;
}