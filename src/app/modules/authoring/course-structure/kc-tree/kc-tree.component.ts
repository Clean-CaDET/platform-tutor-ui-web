import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KnowledgeComponent } from 'src/app/modules/learning/model/knowledge-component.model';
import { Unit } from 'src/app/modules/learning/model/unit.model';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { FormMode, KcFormComponent } from '../kc-form/kc-form.component';
import { KnowledgeComponentService } from './knowledge-component.service';

@Component({
  selector: 'cc-kc-tree',
  templateUrl: './kc-tree.component.html',
  styleUrls: ['./kc-tree.component.scss']
})
export class KcTreeComponent implements OnChanges {
  @Input() unit: Unit;

  nodes: TreeNode[] = [];

  constructor(private dialog: MatDialog, private kcService: KnowledgeComponentService) {}

  ngOnChanges() {
    this.nodes = []
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

      let kc: KnowledgeComponent = {
        description: '',
        code: result.code,
        name: result.name,
        order: result.order,
        expectedDurationInMinutes: result.expectedDurationInMinutes,
        parentId: result.parentId        
      }
      this.kcService.saveKc(this.unit.id, kc).subscribe(newKc => {
        this.unit.knowledgeComponents.push(newKc);
        this.createTree();
      });
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

      this.kcService.updateKc(this.unit.id, result).subscribe(updatedKc => {
        let kc = this.unit.knowledgeComponents.find(kc => kc.id === result.id);
        kc.code = updatedKc.code;
        kc.name = updatedKc.name;
        kc.order = updatedKc.order;
        kc.expectedDurationInMinutes = updatedKc.expectedDurationInMinutes;
        kc.parentId = updatedKc.parentId;
        this.createTree();
      });
    });
  }

  deleteKc(id: number) {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(!result) return;

      this.kcService.deleteKc(this.unit.id, id).subscribe(() => {
        this.unit.knowledgeComponents = [...this.unit.knowledgeComponents.filter(kc => kc.id !== id)];
        this.createTree();
      });
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