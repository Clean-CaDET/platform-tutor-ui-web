import { Component, Input, OnChanges } from '@angular/core';
import { Reflection, ReflectionQuestion } from '../../learning/reflection/reflection.model';
import { ReflectionAuthoringService } from './reflection-authoring.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getCategories, getDefaultQuestions } from './reflection.utility';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cc-reflections',
  templateUrl: './reflections.component.html',
  styleUrl: './reflections.component.scss'
})
export class ReflectionsComponent implements OnChanges {
  @Input() selectedUnitId: number;
  reflections: Reflection[];
  categories = getCategories();

  form: FormGroup;
  isEditing: boolean = false;
  editId: number;
  workingItem: Reflection;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private authoringService: ReflectionAuthoringService) {}

  ngOnChanges(): void {
    this.authoringService.getByUnit(this.selectedUnitId).subscribe(reflections => {
        this.reflections = reflections;
        this.reflections.forEach(r => 
          r.questions.forEach(q => q.categoryName = this.categories
            .find(c => c.id === q.category)?.name));
        this.isEditing = false;
    });
  }

  add(): void {
    const newReflection: Reflection = {
      id: 0,
      order: Math.max(...this.reflections.map(i => i.order), 0) + 1,
      name: 'Osvrt na razvijena znanja i veštine',
      questions: getDefaultQuestions()
    };

    this.reflections.push(newReflection);
    this.initForm(newReflection);
  }

  edit(item: Reflection): void {
    this.workingItem = JSON.parse(JSON.stringify(item));
    this.initForm(this.workingItem);
  }

  private initForm(reflection: Reflection): void {
    this.workingItem = reflection;

    const questionsFA = this.fb.array(
      reflection.questions.map((q) => this.createQuestionGroup(q))
    );

    this.form = this.fb.group({
      id: [reflection.id],
      order: [reflection.order, [Validators.required, Validators.min(1)]],
      name: [reflection.name, [Validators.required, Validators.maxLength(200)]],
      questions: questionsFA
    });

    this.isEditing = true;
    this.editId = reflection.id;
  }

  private createQuestionGroup(q: ReflectionQuestion): FormGroup {
    return this.fb.group({
      id: [q.id],
      order: [q.order],
      text: [q.text, [Validators.required]],
      category: [q.category, [Validators.required]],
      type: [q.type, [Validators.required]],

      labelsText: [
        (q.labels && q.labels.length) ? q.labels.join(', ') : ''
      ]
    });
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  addQuestion(): void {
    const newIdx = this.questions.length + 1;

    const newQuestion: ReflectionQuestion = {
      id: 0,
      order: newIdx,
      text: '',
      category: 0,
      type: 2,
      labels: []
    };

    const fg = this.createQuestionGroup(newQuestion);
    this.questions.push(fg);
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
    let diagRef = this.dialog.open(DeleteFormComponent, {data: {secureDelete: true}});

    diagRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.authoringService.delete(this.selectedUnitId, id).subscribe(() => {
        this.reflections = this.reflections.filter(r => r.id !== id);
      });
    });
  }

  saveOrUpdate(): void {
    if (this.form.invalid) return;

    const formReflection: Reflection = this.getFormData();

    if (formReflection.id === 0) {
      this.authoringService.create(this.selectedUnitId, formReflection).subscribe(newReflection => {
        const idx = this.reflections.findIndex((r) => r.id === 0);
        if (idx !== -1) {
          newReflection.questions.forEach(q => q.categoryName = this.categories.find(c => c.id === q.category)?.name);
          this.reflections[idx] = newReflection;
        }
        this.isEditing = false;
      });
    } else {
      this.authoringService.update(this.selectedUnitId, formReflection).subscribe(updatedReflection => {
        const idx = this.reflections.findIndex((r) => r.id === updatedReflection.id);
        if (idx !== -1) {
          updatedReflection.questions.forEach(q => q.categoryName = this.categories.find(c => c.id === q.category)?.name);
          this.reflections[idx] = updatedReflection;
        }
        this.isEditing = false;
      });
    }
  }

  private getFormData() {
    const formValue = this.form.value as {
      id: number;
      order: number;
      name: string;
      questions: Array<{
        id: number;
        order: number;
        text: string;
        category: number;
        type: number;
        labelsText: string;
      }>;
    };

    const processedQuestions: ReflectionQuestion[] = formValue.questions.map((q) => {
      const labelsArray: string[] = [];
      if (q.type === 2 && q.labelsText) {
        q.labelsText.split(',').forEach(label => {
          const trimmed = label.trim();
          if (trimmed) labelsArray.push(trimmed);
        });
      }
      return {
        id: q.id,
        order: q.order,
        text: q.text,
        category: q.category,
        type: q.type,
        labels: labelsArray
      };
    });

    const finalReflection: Reflection = {
      id: formValue.id,
      order: formValue.order,
      name: formValue.name,
      questions: processedQuestions
    };
    return finalReflection;
  }

  cancel() {
    this.isEditing = false;
    if(!this.workingItem.id) this.reflections = this.reflections.filter(r => r.id);
  }
}