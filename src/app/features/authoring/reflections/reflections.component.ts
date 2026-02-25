import { Component, ChangeDetectionStrategy, inject, input, signal, effect } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Reflection, ReflectionQuestion } from '../../learning/reflection/reflection.model';
import { ReflectionAuthoringService } from './reflection-authoring.service';
import { DeleteFormComponent } from '../../../shared/generics/delete-form/delete-form.component';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';
import { getCategories, getDefaultQuestions } from './reflection.utility';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'cc-reflections',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDividerModule,
    MatTooltipModule, CcMarkdownComponent, JsonPipe,
  ],
  templateUrl: './reflections.component.html',
})
export class ReflectionsComponent {
  private readonly authoringService = inject(ReflectionAuthoringService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly unitId = input.required<number>();

  reflections = signal<Reflection[]>([]);
  isEditing = signal(false);
  editId = signal(0);
  categories = getCategories();
  form!: FormGroup;
  private workingItem: Reflection | null = null;

  constructor() {
    effect(() => {
      const unitId = this.unitId();
      this.loadReflections(unitId);
    });
  }

  private loadReflections(unitId: number): void {
    this.authoringService.getByUnit(unitId).subscribe(reflections => {
      reflections.forEach(r =>
        r.questions.forEach(q => q.categoryName = this.categories.find(c => c.id === q.category)?.name)
      );
      this.reflections.set(reflections);
      this.isEditing.set(false);
    });
  }

  add(): void {
    const current = this.reflections();
    const newReflection: Reflection = {
      id: 0,
      order: Math.max(...current.map(i => i.order), 0) + 1,
      name: 'Osvrt na razvijena znanja i veštine',
      questions: getDefaultQuestions(),
    };
    this.reflections.update(r => [...r, newReflection]);
    this.initForm(newReflection);
  }

  edit(item: Reflection): void {
    this.workingItem = JSON.parse(JSON.stringify(item));
    this.initForm(this.workingItem!);
  }

  private initForm(reflection: Reflection): void {
    this.workingItem = reflection;
    const questionsFA = new FormArray(
      reflection.questions.map(q => this.createQuestionGroup(q))
    );
    this.form = new FormGroup({
      id: new FormControl(reflection.id),
      order: new FormControl(reflection.order, { validators: [Validators.required, Validators.min(1)] }),
      name: new FormControl(reflection.name, { validators: [Validators.required, Validators.maxLength(200)] }),
      questions: questionsFA,
    });
    this.isEditing.set(true);
    this.editId.set(reflection.id);
  }

  private createQuestionGroup(q: ReflectionQuestion): FormGroup {
    return new FormGroup({
      id: new FormControl(q.id),
      order: new FormControl(q.order),
      text: new FormControl(q.text, { validators: [Validators.required] }),
      category: new FormControl(q.category, { validators: [Validators.required] }),
      type: new FormControl(q.type, { validators: [Validators.required] }),
      labelsText: new FormControl(q.labels?.length ? q.labels.join(', ') : ''),
    });
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  addQuestion(): void {
    const newQuestion: ReflectionQuestion = {
      id: 0,
      order: this.questions.length + 1,
      text: '',
      category: 0,
      type: 2,
      labels: [],
    };
    this.questions.push(this.createQuestionGroup(newQuestion));
    this.updateQuestionsOrder();
  }

  removeQuestion(i: number): void {
    this.questions.removeAt(i);
    this.updateQuestionsOrder();
  }

  swapOrder(i: number, j: number): void {
    const fa = this.questions;
    const ctrlI = fa.at(i);
    const ctrlJ = fa.at(j);
    fa.setControl(i, ctrlJ);
    fa.setControl(j, ctrlI);
    this.updateQuestionsOrder();
  }

  private updateQuestionsOrder(): void {
    this.questions.controls.forEach((ctrl, idx) => {
      ctrl.get('order')?.setValue(idx + 1);
    });
  }

  delete(id: number): void {
    const dialogRef = this.dialog.open(DeleteFormComponent, { data: { secureDelete: true } });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.authoringService.delete(this.unitId(), id).subscribe({
        next: () => this.reflections.update(r => r.filter(ref => ref.id !== id)),
        error: () => this.showError(),
      });
    });
  }

  saveOrUpdate(): void {
    if (this.form.invalid) return;
    const formReflection = this.getFormData();
    if (formReflection.id === 0) {
      this.authoringService.create(this.unitId(), formReflection).subscribe({
        next: newReflection => {
          newReflection.questions.forEach(q => q.categoryName = this.categories.find(c => c.id === q.category)?.name);
          this.reflections.update(r => r.map(ref => ref.id === 0 ? newReflection : ref));
          this.isEditing.set(false);
        },
        error: () => this.showError(),
      });
    } else {
      this.authoringService.update(this.unitId(), formReflection).subscribe({
        next: updated => {
          updated.questions.forEach(q => q.categoryName = this.categories.find(c => c.id === q.category)?.name);
          this.reflections.update(r => r.map(ref => ref.id === updated.id ? updated : ref));
          this.isEditing.set(false);
        },
        error: () => this.showError(),
      });
    }
  }

  private getFormData(): Reflection {
    const v = this.form.value;
    const questions: ReflectionQuestion[] = v.questions.map((q: Record<string, unknown>) => {
      const labels: string[] = [];
      if (q['type'] === 2 && q['labelsText']) {
        (q['labelsText'] as string).split(',').forEach(label => {
          const trimmed = label.trim();
          if (trimmed) labels.push(trimmed);
        });
      }
      return { id: q['id'], order: q['order'], text: q['text'], category: q['category'], type: q['type'], labels };
    });
    return { id: v.id, order: v.order, name: v.name, questions };
  }

  cancel(): void {
    this.isEditing.set(false);
    if (!this.workingItem?.id) {
      this.reflections.update(r => r.filter(ref => ref.id !== 0));
    }
  }

  private showError(): void {
    this.snackBar.open('Greška: Zahtev nije obrađen. Probaj da ponoviš operaciju.', 'OK', { horizontalPosition: 'right', verticalPosition: 'top' });
  }
}
