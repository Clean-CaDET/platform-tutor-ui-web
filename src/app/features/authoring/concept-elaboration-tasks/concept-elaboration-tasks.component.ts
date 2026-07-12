import { Component, ChangeDetectionStrategy, inject, input, signal, effect, linkedSignal } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rxResource } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { ConceptElaborationTask, KeyProposition, Misconception } from './model/concept-elaboration-task.model';
import { ConceptElaborationTaskAuthoringService } from './concept-elaboration-task-authoring.service';
import { DeleteFormComponent } from '../../../shared/generics/delete-form/delete-form.component';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';
import { MarkdownEditorComponent } from '../../../shared/markdown/markdown-editor/markdown-editor.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'cc-concept-elaboration-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule,
    MatFormFieldModule, MatInputModule,
    MatTooltipModule,
    CcMarkdownComponent, MarkdownEditorComponent,
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
    defaultValue: [] as ConceptElaborationTask[],
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
      description: '',
      conceptRecord: {
        canonicalDefinition: '',
        keyPropositions: [],
      },
    };
    this.summaries.update(s => [blank, ...s]);
    this.initForm(blank);
  }

  edit(task: ConceptElaborationTask): void {
    const clone: ConceptElaborationTask = JSON.parse(JSON.stringify(task));
    this.initForm(clone);
  }

  private initForm(task: ConceptElaborationTask): void {
    this.workingItem = task;
    const cr = task.conceptRecord;

    const kpGroups = [...cr.keyPropositions].sort((a, b) => a.key.localeCompare(b.key))
      .map(kp => this.createKpGroup(kp));
    const kpArray = new FormArray(kpGroups);
    kpGroups.forEach(g => this.attachUniqueKeyValidator(g, kpArray));

    this.form = new FormGroup({
      id: new FormControl(task.id),
      title: new FormControl(task.title, { validators: [Validators.required, Validators.maxLength(200)] }),
      order: new FormControl(task.order, { validators: [Validators.required, Validators.min(0)] }),
      description: new FormControl(task.description, { validators: [Validators.required] }),
      conceptRecord: new FormGroup({
        canonicalDefinition: new FormControl(cr.canonicalDefinition),
        keyPropositions: kpArray,
      }),
    });
    this.isEditing.set(true);
    this.editId.set(task.id ?? 0);
  }

  private createKpGroup(kp: KeyProposition): FormGroup {
    const group: FormGroup = new FormGroup({
      key: new FormControl(kp.key, { validators: [Validators.required] }),
      statement: new FormControl(kp.statement, { validators: [Validators.required] }),
      hint: new FormControl(kp.hint ?? ''),
    });
    if (kp.misconception) {
      group.addControl('misconception', this.createMisconceptionGroup(kp.misconception));
    }
    return group;
  }

  private createMisconceptionGroup(m?: Misconception): FormGroup {
    return new FormGroup({
      description: new FormControl(m?.description ?? '', { validators: [Validators.required] }),
      correction: new FormControl(m?.correction ?? '', { validators: [Validators.required] }),
    });
  }

  private attachUniqueKeyValidator(group: FormGroup, array: FormArray): void {
    const keyCtrl = group.get('key')!;
    keyCtrl.addValidators(this.uniqueKeyInArray(array, keyCtrl));
  }

  private uniqueKeyInArray(array: FormArray, self: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;
      const isDuplicate = array.controls.some(c => {
        const k = (c as FormGroup).get('key');
        return k && k !== self && k.value === value;
      });
      return isDuplicate ? { duplicateKey: true } : null;
    };
  }

  private nextKey(array: FormArray, prefix: string): string {
    const nums = array.controls
      .map(c => parseInt(((c as FormGroup).get('key')?.value as string ?? '').replace(prefix, ''), 10))
      .filter(n => !isNaN(n));
    return prefix + ((nums.length ? Math.max(...nums) : 0) + 1);
  }

  get conceptRecord(): FormGroup { return this.form.get('conceptRecord') as FormGroup; }
  get keyPropositions(): FormArray { return this.conceptRecord.get('keyPropositions') as FormArray; }

  addKeyProposition(): void {
    const group = this.createKpGroup({ key: this.nextKey(this.keyPropositions, 'P'), statement: '' });
    this.attachUniqueKeyValidator(group, this.keyPropositions);
    this.keyPropositions.push(group);
  }

  addMisconception(kpGroup: FormGroup): void {
    kpGroup.addControl('misconception', this.createMisconceptionGroup());
  }

  removeMisconception(kpGroup: FormGroup): void {
    kpGroup.removeControl('misconception');
  }

  onDescriptionChange(value: string): void {
    const ctrl = this.form.get('description');
    ctrl?.setValue(value);
    ctrl?.markAsDirty();
  }

  removeItem(array: FormArray, index: number): void {
    array.removeAt(index);
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
          this.summaries.update(s =>
            s.map(x => x.id === 0 ? created : x).sort((a, b) => a.order - b.order),
          );
          this.isEditing.set(false);
        },
        error: () => {},
      });
    } else {
      this.service.update(this.unitId(), task).subscribe({
        next: updated => {
          this.summaries.update(s =>
            s.map(x => x.id === updated.id ? updated : x).sort((a, b) => a.order - b.order),
          );
          this.isEditing.set(false);
        },
        error: () => {},
      });
    }
  }

  private getFormData(): ConceptElaborationTask {
    const v = this.form.value;
    return {
      id: v.id,
      unitId: this.unitId(),
      order: v.order,
      title: v.title,
      description: v.description,
      conceptRecord: {
        canonicalDefinition: v.conceptRecord.canonicalDefinition ?? "",
        keyPropositions: this.keyPropositions.controls.map(ctrl => {
          const kpGroup = ctrl as FormGroup;
          const misc = kpGroup.get('misconception') as FormGroup | null;
          return {
            key: kpGroup.get('key')?.value,
            statement: kpGroup.get('statement')?.value,
            hint: kpGroup.get('hint')?.value?.trim() || null,
            misconception: misc
              ? { description: misc.get('description')?.value, correction: misc.get('correction')?.value }
              : null,
          };
        }),
      },
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
