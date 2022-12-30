import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KnowledgeComponent } from 'src/app/modules/learning/model/knowledge-component.model';
import { Unit } from 'src/app/modules/learning/model/unit.model';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
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
      this.createTree();
    }
  }

  private createTree() {
    let rootKc = this.unit.knowledgeComponents.find(kc => !kc.parentId);
    this.nodes = [this.createNode(rootKc)];
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

  addKc(parentId: number) {
    const dialogRef = this.dialog.open(KcFormComponent, {
      data: {
        knowledgeComponent: parentId ? { parentId: parentId } : null,
        parentComponentOptions: this.unit.knowledgeComponents,
        formMode: parentId ? FormMode.AddChild : FormMode.AddFirst
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;

      // TODO: Send to backend. If success regenerate the KC tree in the code below.
      let kc: KnowledgeComponent = {
        id: 0, //Currently causes issue because root KC parent is 0
        description: '',
        code: result.code,
        name: result.name,
        order: result.order,
        expectedDurationInMinutes: result.expectedDurationInMinutes,
        parentId: result.parentId
      }
      this.unit.knowledgeComponents.push(kc);
      this.createTree();
    });
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
      let kc = this.unit.knowledgeComponents.find(kc => kc.id === result.id);
      kc.code = result.code;
      kc.name = result.name;
      kc.order = result.order;
      kc.expectedDurationInMinutes = result.expectedDurationInMinutes;
      kc.parentId = result.parentId;
      this.createTree();
    });
  }

  deleteKc(id: number) {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(result) console.log(id); //TODO
    })
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