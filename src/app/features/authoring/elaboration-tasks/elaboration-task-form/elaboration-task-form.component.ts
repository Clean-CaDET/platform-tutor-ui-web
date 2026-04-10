import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { ElaborationTask } from '../model/elaboration-task.model';
import { ConceptRecord } from '../../concept-records/model/concept-record.model';
import { ConceptRecordAuthoringService } from '../../concept-records/concept-record-authoring.service';

interface DialogData {
  task: ElaborationTask | null;
  courseId: number;
  defaultOrder?: number;
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

@Component({
  selector: 'cc-elaboration-task-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatDialogContent, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatAutocompleteModule, MatButtonModule,
  ],
  templateUrl: './elaboration-task-form.component.html',
})
export class ElaborationTaskFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ElaborationTaskFormComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly conceptRecordService = inject(ConceptRecordAuthoringService);

  readonly levels = LEVELS;
  readonly conceptRecords = signal<ConceptRecord[]>([]);

  conceptRecordControl = new FormControl('', { validators: [Validators.required] });
  form = new FormGroup({
    expectedLevel: new FormControl(this.data.task?.expectedLevel || 'Beginner', { validators: [Validators.required] }),
    order: new FormControl(this.data.task?.order ?? this.data.defaultOrder ?? 1, { validators: [Validators.required, Validators.min(1)] }),
  });

  private readonly filterText = toSignal(
    this.conceptRecordControl.valueChanges.pipe(startWith('')),
    { initialValue: '' },
  );

  readonly filteredRecords = computed(() => {
    const filter = (this.filterText() || '').toLowerCase();
    return this.conceptRecords().filter(r => r.title.toLowerCase().includes(filter));
  });

  private selectedRecord: ConceptRecord | null = null;

  constructor() {
    this.conceptRecordService.getByCourse(this.data.courseId).subscribe(records => {
      this.conceptRecords.set(records);
      if (this.data.task) {
        const match = records.find(r => r.id === this.data.task!.conceptRecordId);
        if (match) {
          this.conceptRecordControl.setValue(match.title);
          this.selectedRecord = match;
        }
      }
    });
  }

  onRecordSelected(title: string): void {
    this.selectedRecord = this.conceptRecords().find(r => r.title === title) ?? null;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.selectedRecord) return;
    const task: ElaborationTask = {
      conceptRecordId: this.selectedRecord.id!,
      expectedLevel: this.form.value.expectedLevel!,
      order: this.form.value.order!,
    };
    this.dialogRef.close(task);
  }

  onClose(): void {
    this.dialogRef.close(null);
  }

  isSubmitDisabled(): boolean {
    return this.form.invalid || !this.selectedRecord;
  }
}
