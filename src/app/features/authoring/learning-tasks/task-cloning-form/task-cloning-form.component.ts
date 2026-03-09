import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LearningTask } from '../../../learning/task/model/learning-task.model';
import { Activity } from '../../../learning/task/model/activity.model';

@Component({
  selector: 'cc-task-cloning-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatButtonModule, MatIconModule, MatTooltipModule,
  ],
  template: `
    <mat-dialog-content>
      <div class="flex-row" style="gap: 20px">
        <form [formGroup]="form" class="flex-col" style="width: 800px;">
          <section class="flex-row gap" style="align-items: center">
            <mat-form-field style="flex-grow: 1;">
              <mat-label>Naziv</mat-label>
              <input matInput formControlName="name">
            </mat-form-field>
            <mat-form-field style="width: 70px;">
              <mat-label>R. broj</mat-label>
              <input type="number" matInput formControlName="order">
            </mat-form-field>
            <section matTooltip="Šablon definiše klasu sličnih zadataka čije instance imaju isti raspored koraka.">
              <mat-checkbox formControlName="isTemplate" style="padding-top: 10px;">
                Šablon
                <mat-icon style="font-size: 16px;">help_outline</mat-icon>
              </mat-checkbox>
            </section>
          </section>
          <mat-form-field>
            <mat-label>Opis</mat-label>
            <textarea matInput formControlName="description" rows="8"></textarea>
          </mat-form-field>
          <div class="flex-row gap">
            <button matButton="filled" [disabled]="!form.valid" (click)="save()">
              <mat-icon>check</mat-icon> Sačuvaj
            </button>
            <button matButton (click)="close()">Zatvori</button>
          </div>
        </form>
        @if (template) {
          <div style="width: 250px;">
            <b>{{ template.name }}</b>
            <ol>
              @for (step of getMainSteps(template); track step.code) {
                <li>{{ step.code }}: {{ step.name }}</li>
              }
            </ol>
          </div>
        }
      </div>
    </mat-dialog-content>
  `,
})
export class TaskCloningFormComponent {
  private readonly dialogRef = inject(MatDialogRef<TaskCloningFormComponent>);
  private readonly data = inject<{ template?: LearningTask; newOrder: number }>(MAT_DIALOG_DATA);

  readonly template = this.data.template ?? null;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(this.template?.description ?? '', { nonNullable: true }),
    order: new FormControl(this.data.newOrder, { nonNullable: true, validators: [Validators.required] }),
    isTemplate: new FormControl(false, { nonNullable: true }),
  });

  save(): void {
    const task: Record<string, unknown> = { ...this.form.getRawValue(), steps: this.cloneSteps() };
    this.dialogRef.close(task);
  }

  private cloneSteps(): Activity[] {
    if (!this.template?.steps) return [];
    return this.template.steps.map(step => {
      const cloned: Activity = JSON.parse(JSON.stringify(step));
      cloned.submissionFormat = step.submissionFormat;
      delete cloned.id;
      cloned.standards?.forEach(s => delete s.id);
      return cloned;
    });
  }

  getMainSteps(task: LearningTask): Activity[] {
    return (task.steps ?? []).filter(s => !s.parentId);
  }

  close(): void {
    this.dialogRef.close();
  }
}
