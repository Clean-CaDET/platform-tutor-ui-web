import { Component, ChangeDetectionStrategy, inject, input, output, linkedSignal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HttpContext } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rxResource } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { SKIP_GLOBAL_ERROR } from '../../../../core/http/global-ui.interceptor';
import { NotificationService } from '../../../../core/notification/notification.service';
import { KnowledgeComponent } from '../../model/knowledge-component.model';
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
  private readonly notify = inject(NotificationService);
  private readonly kcService = inject(KnowledgeComponentAuthoringService);

  readonly unitId = input.required<number>();
  readonly kcsChanged = output<KnowledgeComponent[]>();

  private readonly kcsResource = rxResource({
    params: () => ({ unitId: this.unitId() }),
    stream: ({ params }) => this.kcService.getByUnit(params.unitId),
    defaultValue: [],
  });

  private kcs = linkedSignal(() => this.kcsResource.value());
  readonly nodes = linkedSignal(() => this.buildTree(this.kcs()));

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

  private buildTree(kcs: KnowledgeComponent[]): TreeNode[] {
    const rootKc = kcs.find(kc => !kc.parentId);
    if (!rootKc) return [];
    return [this.createNode(rootKc, kcs)];
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

  addKc(parentId?: number): void {
    const kcs = this.kcs();
    const dialogRef = this.dialog.open(KcFormComponent, {
      minWidth: '900px',
      data: {
        knowledgeComponent: {
          parentId: parentId,
          knowledgeUnitId: this.unitId(),
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
          knowledgeUnitId: this.unitId(),
        };
        return this.kcService.create(kc);
      }),
    ).subscribe(newKc => {
      const updatedKcs = [...kcs, newKc];
      this.kcs.set(updatedKcs);
      this.kcsChanged.emit(updatedKcs);
    });
  }

  editKc(id: number): void {
    const kcs = this.kcs();
    const kc = kcs.find(k => k.id === id);
    if (!kc) return;

    const dialogRef = this.dialog.open(KcFormComponent, {
      minWidth: '900px',
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
      this.kcs.set(updatedKcs);
      this.kcsChanged.emit(updatedKcs);
    });
  }

  deleteKc(id: number): void {
    this.dialog.open(DeleteFormComponent, { data: { secureDelete: true } }).afterClosed().pipe(
      filter(Boolean),
      switchMap(() => this.kcService.delete(id, new HttpContext().set(SKIP_GLOBAL_ERROR, true))),
    ).subscribe({
      next: () => {
        const updatedKcs = this.kcs().filter(kc => kc.id !== id);
        this.kcs.set(updatedKcs);
        this.kcsChanged.emit(updatedKcs);
      },
      error: (err) => {
        if (err.status === 409) {
          this.notify.error('Nije moguće obrisati KZ koji ima potomke.');
        } else {
          this.notify.error();
        }
      },
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
