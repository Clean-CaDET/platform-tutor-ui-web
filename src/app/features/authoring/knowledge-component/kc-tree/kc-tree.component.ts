import { Component, ChangeDetectionStrategy, inject, input, output, signal, effect } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, switchMap } from 'rxjs';
import { Unit } from '../../../../shared/model/unit.model';
import { KnowledgeComponent } from '../../../../shared/model/knowledge-component.model';
import { DeleteFormComponent } from '../../../../shared/generics/delete-form/delete-form.component';
import { KnowledgeComponentAuthoringService } from '../knowledge-component-authoring.service';
import { KcFormComponent, FormMode } from '../kc-form/kc-form.component';

interface TreeNode {
  id: number;
  code: string;
  name: string;
  order: number;
  expectedDurationInMinutes: number;
  children: TreeNode[];
  isExpanded: boolean;
}

@Component({
  selector: 'cc-kc-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './kc-tree.component.html',
  styleUrl: './kc-tree.component.scss',
})
export class KcTreeComponent {
  private readonly dialog = inject(MatDialog);
  private readonly kcService = inject(KnowledgeComponentAuthoringService);

  readonly unit = input.required<Unit>();
  readonly unitChanged = output<Unit>();
  readonly nodes = signal<TreeNode[]>([]);

  constructor() {
    effect(() => {
      const unit = this.unit();
      if (unit?.knowledgeComponents?.length) {
        this.buildTree(unit.knowledgeComponents);
      } else {
        this.nodes.set([]);
      }
    });
  }

  toggleExpand(nodeId: number): void {
    this.nodes.update(nodes => this.toggleNodeInTree(nodes, nodeId));
  }

  private toggleNodeInTree(nodes: TreeNode[], nodeId: number): TreeNode[] {
    return nodes.map(node => {
      if (node.id === nodeId) return { ...node, isExpanded: !node.isExpanded };
      if (node.children.length) return { ...node, children: this.toggleNodeInTree(node.children, nodeId) };
      return node;
    });
  }

  private buildTree(kcs: KnowledgeComponent[]): void {
    const rootKc = kcs.find(kc => !kc.parentId);
    if (!rootKc) {
      this.nodes.set([]);
      return;
    }
    this.nodes.set([this.createNode(rootKc, kcs)]);
  }

  private createNode(kc: KnowledgeComponent, allKcs: KnowledgeComponent[]): TreeNode {
    const children = allKcs
      .filter(c => c.parentId === kc.id)
      .sort((a, b) => a.order - b.order)
      .map(c => this.createNode(c, allKcs));
    return {
      id: kc.id!,
      code: kc.code,
      name: kc.name,
      order: kc.order,
      expectedDurationInMinutes: kc.expectedDurationInMinutes,
      children,
      isExpanded: true,
    };
  }

  private emitUpdatedUnit(kcs: KnowledgeComponent[]): void {
    const unit = this.unit();
    this.unitChanged.emit({ ...unit, knowledgeComponents: kcs });
  }

  addKc(parentId?: number): void {
    const unit = this.unit();
    const kcs = unit.knowledgeComponents ?? [];
    const dialogRef = this.dialog.open(KcFormComponent, {
      data: {
        knowledgeComponent: {
          parentId: parentId,
          knowledgeUnitId: unit.id,
          order: parentId ? this.getMaxChildOrder(parentId, kcs) + 1 : 10,
        },
        allKcs: kcs,
        parentComponentOptions: kcs,
        formMode: parentId ? FormMode.AddChild : FormMode.AddFirst,
      },
    });

    dialogRef.afterClosed().pipe(
      filter(Boolean),
      switchMap(result => {
        const kc: KnowledgeComponent = {
          description: '',
          code: result.code,
          name: result.name,
          order: result.order,
          expectedDurationInMinutes: result.expectedDurationInMinutes,
          parentId: result.parentId,
          knowledgeUnitId: unit.id!,
        };
        return this.kcService.create(kc);
      }),
    ).subscribe(newKc => {
      this.emitUpdatedUnit([...kcs, newKc]);
    });
  }

  editKc(id: number): void {
    const unit = this.unit();
    const kcs = unit.knowledgeComponents ?? [];
    const kc = kcs.find(k => k.id === id);
    if (!kc) return;

    const dialogRef = this.dialog.open(KcFormComponent, {
      data: {
        knowledgeComponent: kc,
        allKcs: kcs,
        parentComponentOptions: this.getNonChildComponents(kc, kcs),
        formMode: kc.parentId ? FormMode.EditChild : FormMode.EditFirst,
      },
    });

    dialogRef.afterClosed().pipe(
      filter(Boolean),
      switchMap(result => this.kcService.update(result)),
    ).subscribe(updatedKc => {
      const updatedKcs = kcs.map(k => k.id === updatedKc.id ? updatedKc : k);
      this.emitUpdatedUnit(updatedKcs);
    });
  }

  deleteKc(id: number): void {
    this.dialog.open(DeleteFormComponent, { data: { secureDelete: true } }).afterClosed().pipe(
      filter(Boolean),
      switchMap(() => this.kcService.delete(id)),
    ).subscribe(() => {
      const kcs = (this.unit().knowledgeComponents ?? []).filter(kc => kc.id !== id);
      this.emitUpdatedUnit(kcs);
    });
  }

  private getMaxChildOrder(parentId: number, kcs: KnowledgeComponent[]): number {
    const children = kcs.filter(kc => kc.parentId === parentId);
    if (children.length === 0) return 0;
    return Math.max(...children.map(kc => kc.order));
  }

  private getNonChildComponents(kc: KnowledgeComponent, kcs: KnowledgeComponent[]): KnowledgeComponent[] {
    const childIds = new Set<number>();
    const collectChildren = (parentId: number) => {
      for (const child of kcs.filter(c => c.parentId === parentId)) {
        if (child.id != null) {
          childIds.add(child.id);
          collectChildren(child.id);
        }
      }
    };
    if (kc.id != null) {
      collectChildren(kc.id);
      childIds.add(kc.id);
    }
    return kcs.filter(c => c.id != null && !childIds.has(c.id));
  }
}
