import { Component, ChangeDetectionStrategy, inject, input, signal, effect, linkedSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rxResource } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import {
  ConceptElaborationTask,
  ConceptElaborationTaskSummary,
  KeyProposition,
  BoundaryCondition,
  CommonMisconception,
  KeyRelation,
} from './model/concept-elaboration-task.model';
import { ConceptElaborationTaskAuthoringService } from './concept-elaboration-task-authoring.service';
import { DeleteFormComponent } from '../../../shared/generics/delete-form/delete-form.component';

@Component({
  selector: 'cc-concept-elaboration-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './concept-elaboration-tasks.component.html',
})
export class ConceptElaborationTasksComponent {
  private readonly service = inject(ConceptElaborationTaskAuthoringService);
  private readonly dialog = inject(MatDialog);
  readonly unitId = input.required<number>();

  private readonly summariesResource = rxResource({
    params: () => ({ unitId: this.unitId() }),
    stream: ({ params }) => this.service.getByUnit(params.unitId),
    defaultValue: [] as ConceptElaborationTaskSummary[],
  });

  summaries = linkedSignal(() =>
    [...this.summariesResource.value()].sort((a, b) => a.order - b.order),
  );
  isEditing = signal(false);
  editId = signal(0);
  form!: FormGroup;
  private workingItem: ConceptElaborationTask | null = null;

  constructor() {
    effect(() => {
      this.summariesResource.value();
      this.isEditing.set(false);
    });
  }

  add(): void {
    const rows = this.summaries();
    const maxOrder = rows.length ? Math.max(...rows.map(s => s.order)) : 0;
    const blank: ConceptElaborationTask = {
      id: 0,
      unitId: this.unitId(),
      order: maxOrder + 1,
      title: '',
      canonicalDefinition: '',
      keyPropositions: [],
      boundaryConditions: [],
      commonMisconceptions: [],
      keyRelations: [],
    };
    const syntheticSummary: ConceptElaborationTaskSummary = {
      id: 0,
      unitId: this.unitId(),
      order: blank.order,
      title: '',
      hasCompletedAttempt: false,
    };
    this.summaries.update(s => [syntheticSummary, ...s]);
    this.initForm(blank);
  }

  edit(summary: ConceptElaborationTaskSummary): void {
    this.service.get(this.unitId(), summary.id).subscribe({
      next: full => {
        const clone: ConceptElaborationTask = JSON.parse(JSON.stringify(full));
        this.initForm(clone);
      },
      error: () => {},
    });
  }

  private initForm(task: ConceptElaborationTask): void {
    this.workingItem = task;
    const sortedKps = [...task.keyPropositions].sort((a, b) => a.statement.localeCompare(b.statement));
    const kpGroups = sortedKps.map(kp => this.createKpGroup(kp));
    this.form = new FormGroup({
      id: new FormControl(task.id),
      title: new FormControl(task.title, { validators: [Validators.required, Validators.maxLength(200)] }),
      order: new FormControl(task.order, { validators: [Validators.required, Validators.min(0)] }),
      canonicalDefinition: new FormControl(task.canonicalDefinition, { validators: [Validators.required] }),
      keyPropositions: new FormArray(kpGroups),
      boundaryConditions: new FormArray(
        [...task.boundaryConditions].sort((a, b) => a.statement.localeCompare(b.statement))
          .map(bc => this.createBcGroup(bc)),
      ),
      commonMisconceptions: new FormArray(
        [...task.commonMisconceptions].sort((a, b) => a.description.localeCompare(b.description))
          .map(cm => this.createCmGroup(cm)),
      ),
      keyRelations: new FormArray(
        [...(task.keyRelations ?? [])].sort((a, b) => (a.mechanism ?? '').localeCompare(b.mechanism ?? ''))
          .map(kr => {
            const sourceKpGroup = kpGroups.find(g => g.get('id')?.value === kr.sourceKeyPropositionId) ?? null;
            const targetKpGroup = kpGroups.find(g => g.get('id')?.value === kr.targetKeyPropositionId) ?? null;
            return this.createKrGroup(sourceKpGroup, targetKpGroup, kr);
          }),
      ),
    });
    this.isEditing.set(true);
    this.editId.set(task.id ?? 0);
  }

  private createKpGroup(kp: KeyProposition): FormGroup {
    return new FormGroup({
      id: new FormControl(kp.id),
      statement: new FormControl(kp.statement, { validators: [Validators.required] }),
    });
  }

  private createBcGroup(bc: BoundaryCondition): FormGroup {
    return new FormGroup({
      id: new FormControl(bc.id),
      statement: new FormControl(bc.statement, { validators: [Validators.required] }),
    });
  }

  private createCmGroup(cm: CommonMisconception): FormGroup {
    return new FormGroup({
      id: new FormControl(cm.id),
      description: new FormControl(cm.description, { validators: [Validators.required] }),
      correction: new FormControl(cm.correction, { validators: [Validators.required] }),
    });
  }

  private createKrGroup(sourceKpGroup: FormGroup | null, targetKpGroup: FormGroup | null, kr: Partial<KeyRelation>): FormGroup {
    return new FormGroup({
      id: new FormControl(kr.id),
      sourceKpCtrl: new FormControl(sourceKpGroup, { validators: [Validators.required] }),
      targetKpCtrl: new FormControl(targetKpGroup, { validators: [Validators.required] }),
      mechanism: new FormControl(kr.mechanism ?? '', { validators: [Validators.required] }),
    });
  }

  get keyPropositions(): FormArray { return this.form.get('keyPropositions') as FormArray; }
  get boundaryConditions(): FormArray { return this.form.get('boundaryConditions') as FormArray; }
  get commonMisconceptions(): FormArray { return this.form.get('commonMisconceptions') as FormArray; }
  get keyRelations(): FormArray { return this.form.get('keyRelations') as FormArray; }

  addKeyProposition(): void {
    this.keyPropositions.push(this.createKpGroup({ statement: '' }));
  }

  addBoundaryCondition(): void {
    this.boundaryConditions.push(this.createBcGroup({ statement: '' }));
  }

  addCommonMisconception(): void {
    this.commonMisconceptions.push(this.createCmGroup({ description: '', correction: '' }));
  }

  addKeyRelation(): void {
    this.keyRelations.push(this.createKrGroup(null, null, {}));
  }

  removeItem(array: FormArray, index: number): void {
    array.removeAt(index);
  }

  isKpReferencedByKr(index: number): boolean {
    const kpGroup = this.keyPropositions.at(index);
    return this.keyRelations.controls.some(ctrl => {
      const kr = ctrl as FormGroup;
      return kr.get('sourceKpCtrl')?.value === kpGroup || kr.get('targetKpCtrl')?.value === kpGroup;
    });
  }

  delete(id: number): void {
    this.dialog.open(DeleteFormComponent).afterClosed().pipe(
      filter(Boolean),
      switchMap(() => this.service.delete(this.unitId(), id)),
    ).subscribe({
      next: () => this.summaries.update(s => s.filter(x => x.id !== id)),
      error: () => {},
    });
  }

  saveOrUpdate(): void {
    if (this.form.invalid) return;
    const task = this.getFormData();
    if (!task.id) {
      this.service.create(this.unitId(), task).subscribe({
        next: created => {
          const summary: ConceptElaborationTaskSummary = {
            id: created.id!,
            unitId: this.unitId(),
            order: created.order,
            title: created.title,
            hasCompletedAttempt: false,
          };
          this.summaries.update(s =>
            s.map(x => x.id === 0 ? summary : x).sort((a, b) => a.order - b.order),
          );
          this.isEditing.set(false);
        },
        error: () => {},
      });
    } else {
      this.service.update(this.unitId(), task).subscribe({
        next: updated => {
          this.summaries.update(s =>
            s.map(x => x.id === updated.id
              ? { ...x, order: updated.order, title: updated.title }
              : x,
            ).sort((a, b) => a.order - b.order),
          );
          this.isEditing.set(false);
        },
        error: () => {},
      });
    }
  }

  private getFormData(): ConceptElaborationTask {
    const v = this.form.value;
    const kpControls = this.keyPropositions.controls;
    return {
      id: v.id,
      unitId: this.unitId(),
      order: v.order,
      title: v.title,
      canonicalDefinition: v.canonicalDefinition,
      keyPropositions: v.keyPropositions ?? [],
      boundaryConditions: v.boundaryConditions ?? [],
      commonMisconceptions: v.commonMisconceptions ?? [],
      keyRelations: this.keyRelations.controls.map(ctrl => {
        const krGroup = ctrl as FormGroup;
        return {
          id: krGroup.get('id')?.value,
          sourceKeyPropositionIndex: kpControls.indexOf(krGroup.get('sourceKpCtrl')?.value),
          targetKeyPropositionIndex: kpControls.indexOf(krGroup.get('targetKpCtrl')?.value),
          mechanism: krGroup.get('mechanism')?.value,
        };
      }),
    };
  }

  cancel(): void {
    if (this.form.dirty && !confirm('Izmene nisu sačuvane. Da li želite da odustanete?')) return;
    this.isEditing.set(false);
    if (!this.workingItem?.id) {
      this.summaries.update(s => s.filter(x => x.id !== 0));
    }
  }
}
