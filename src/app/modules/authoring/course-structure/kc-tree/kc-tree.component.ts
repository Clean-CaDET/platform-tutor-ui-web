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

  nodes: TreeNode[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnChanges() {
    if(this.unit?.knowledgeComponents.length) {
      let rootKc = this.unit.knowledgeComponents.find(kc => !kc.parentId);
      this.nodes.push(this.createNode(rootKc));
    }
  }

  createNode(kc: KnowledgeComponent): TreeNode {
    let node: TreeNode = {
      id: kc.id,
      code: kc.code,
      name: kc.name,
      order: kc.order,
      children: this.findKnowledgeSubcomponents(kc.id).map(kc => this.createNode(kc)),
      isExpanded: true
    }
    return node;
  }

  findKnowledgeSubcomponents(parentId: number): KnowledgeComponent[] {
    return this.unit.knowledgeComponents.filter(kc => kc.parentId === parentId);
  }

  editKc(id: number): void {
    let kc = this.unit.knowledgeComponents.find(kc => kc.id === id);
    
    const dialogRef = this.dialog.open(KcFormComponent, {
      data: {
        knowledgeComponent: kc,
        parentComponentOptions: this.getNonChildComponents(kc),
        formMode: kc.parentId ? FormMode.EditChild : FormMode.EditFirst
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      // TODO: Send to backend. If success regenerate the KC tree in the code below.
    });
  }
  
  private getNonChildComponents(kc: KnowledgeComponent): KnowledgeComponent[] {
    let childComponents = this.getChildComponents(kc.id);
    childComponents.push(kc);
    return this.unit.knowledgeComponents.filter(component => !childComponents.includes(component));
  }
  
  private getChildComponents(kcId: number): KnowledgeComponent[] {
    let subcomponents = this.findKnowledgeSubcomponents(kcId);
    let childComponents = [... subcomponents];
    
    subcomponents.forEach(subcomponent => {
      childComponents = childComponents.concat(this.getChildComponents(subcomponent.id));
    });

    return childComponents;
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