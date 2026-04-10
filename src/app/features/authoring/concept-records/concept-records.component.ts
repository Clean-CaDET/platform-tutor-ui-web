import { Component, ChangeDetectionStrategy, inject, input, signal, effect, linkedSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpContext } from '@angular/common/http';
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
import { SKIP_GLOBAL_ERROR } from '../../../core/http/global-ui.interceptor';
import { NotificationService } from '../../../core/notification/notification.service';
import { ConceptRecord, KeyProposition, BoundaryCondition, CommonMisconception, KeyRelation } from './model/concept-record.model';
import { ConceptRecordAuthoringService } from './concept-record-authoring.service';
import { DeleteFormComponent } from '../../../shared/generics/delete-form/delete-form.component';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

@Component({
  selector: 'cc-concept-records',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './concept-records.component.html',
})
export class ConceptRecordsComponent {
  private readonly service = inject(ConceptRecordAuthoringService);
  private readonly dialog = inject(MatDialog);
  private readonly notify = inject(NotificationService);
  readonly courseId = input.required<number>();

  readonly levels = LEVELS;

  private readonly recordsResource = rxResource({
    params: () => ({ courseId: this.courseId() }),
    stream: ({ params }) => this.service.getByCourse(params.courseId),
    defaultValue: [],
  });

  records = linkedSignal(() => this.recordsResource.value());
  isEditing = signal(false);
  editId = signal(0);
  form!: FormGroup;
  private workingItem: ConceptRecord | null = null;

  constructor() {
    effect(() => {
      this.recordsResource.value();
      this.isEditing.set(false);
    });
  }

  add(): void {
    const newRecord: ConceptRecord = {
      id: 0,
      title: '',
      canonicalDefinition: '',
      keyPropositions: [],
      boundaryConditions: [],
      commonMisconceptions: [],
      keyRelations: [],
    };
    this.records.update(r => [newRecord, ...r]);
    this.initForm(newRecord);
  }

  edit(item: ConceptRecord): void {
    this.workingItem = JSON.parse(JSON.stringify(item));
    this.initForm(this.workingItem!);
  }

  private initForm(record: ConceptRecord): void {
    this.workingItem = record;
    const sortedKps = [...record.keyPropositions].sort((a, b) => a.statement.localeCompare(b.statement));
    const kpGroups = sortedKps.map(kp => this.createKpGroup(kp));
    this.form = new FormGroup({
      id: new FormControl(record.id),
      title: new FormControl(record.title, { validators: [Validators.required, Validators.maxLength(200)] }),
      canonicalDefinition: new FormControl(record.canonicalDefinition, { validators: [Validators.required] }),
      keyPropositions: new FormArray(kpGroups),
      boundaryConditions: new FormArray(
        [...record.boundaryConditions].sort((a, b) => a.statement.localeCompare(b.statement))
          .map(bc => this.createBcGroup(bc)),
      ),
      commonMisconceptions: new FormArray(
        [...record.commonMisconceptions].sort((a, b) => a.description.localeCompare(b.description))
          .map(cm => this.createCmGroup(cm)),
      ),
      keyRelations: new FormArray(
        [...(record.keyRelations ?? [])].sort((a, b) => (a.mechanism ?? '').localeCompare(b.mechanism ?? ''))
          .map(kr => {
            const sourceKpGroup = kpGroups.find(g => g.get('id')?.value === kr.sourceKeyPropositionId) ?? null;
            const targetKpGroup = kpGroups.find(g => g.get('id')?.value === kr.targetKeyPropositionId) ?? null;
            return this.createKrGroup(sourceKpGroup, targetKpGroup, kr);
          }),
      ),
    });
    this.isEditing.set(true);
    this.editId.set(record.id ?? 0);
  }

  private createKpGroup(kp: KeyProposition): FormGroup {
    return new FormGroup({
      id: new FormControl(kp.id),
      statement: new FormControl(kp.statement, { validators: [Validators.required] }),
      level: new FormControl(kp.level, { validators: [Validators.required] }),
    });
  }

  private createBcGroup(bc: BoundaryCondition): FormGroup {
    return new FormGroup({
      id: new FormControl(bc.id),
      statement: new FormControl(bc.statement, { validators: [Validators.required] }),
      level: new FormControl(bc.level, { validators: [Validators.required] }),
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
      level: new FormControl(kr.level ?? 'Beginner', { validators: [Validators.required] }),
    });
  }

  get keyPropositions(): FormArray { return this.form.get('keyPropositions') as FormArray; }
  get boundaryConditions(): FormArray { return this.form.get('boundaryConditions') as FormArray; }
  get commonMisconceptions(): FormArray { return this.form.get('commonMisconceptions') as FormArray; }
  get keyRelations(): FormArray { return this.form.get('keyRelations') as FormArray; }

  addKeyProposition(): void {
    this.keyPropositions.push(this.createKpGroup({ statement: '', level: 'Beginner' }));
  }

  addBoundaryCondition(): void {
    this.boundaryConditions.push(this.createBcGroup({ statement: '', level: 'Beginner' }));
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
      switchMap(() => this.service.delete(this.courseId(), id, new HttpContext().set(SKIP_GLOBAL_ERROR, true))),
    ).subscribe({
      next: () => this.records.update(r => r.filter(rec => rec.id !== id)),
      error: (err) => {
        if (err.status === 409) {
          this.notify.error('Koncept je dodeljen elaboracijskim zadacima. Prvo ukloni zadatke.');
        } else {
          this.notify.error();
        }
      },
    });
  }

  saveOrUpdate(): void {
    if (this.form.invalid) return;
    const record = this.getFormData();
    if (!record.id) {
      this.service.create(this.courseId(), record).subscribe({
        next: created => {
          this.records.update(r => r.map(rec => rec.id === 0 ? created : rec));
          this.isEditing.set(false);
        },
        error: () => {},
      });
    } else {
      this.service.update(this.courseId(), record).subscribe({
        next: updated => {
          this.records.update(r => r.map(rec => rec.id === updated.id ? updated : rec));
          this.isEditing.set(false);
        },
        error: () => {},
      });
    }
  }

  private getFormData(): ConceptRecord {
    const v = this.form.value;
    const kpControls = this.keyPropositions.controls;
    return {
      id: v.id,
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
          level: krGroup.get('level')?.value,
        };
      }),
    };
  }

  cancel(): void {
    if (this.form.dirty && !confirm('Izmene nisu sačuvane. Da li želite da odustanete?')) return;
    this.isEditing.set(false);
    if (!this.workingItem?.id) {
      this.records.update(r => r.filter(rec => rec.id !== 0));
    }
  }
}
