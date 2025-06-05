import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Reflection, ReflectionQuestion, ReflectionQuestionCategory } from '../../learning/reflection/reflection.model';
import { ReflectionAuthoringService } from './reflection-authoring.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getDefaultQuestions } from './reflection.utility';

@Component({
  selector: 'cc-reflections',
  templateUrl: './reflections.component.html',
  styleUrl: './reflections.component.scss'
})
export class ReflectionsComponent implements OnInit, OnChanges {
  @Input() selectedUnitId: number;
  reflections: Reflection[];
  categories: ReflectionQuestionCategory[];

  form: FormGroup;
  isEditing: boolean = false;
  editId: number;
  workingItem: Reflection;

  constructor(private fb: FormBuilder, private authoringService: ReflectionAuthoringService) {}

  ngOnInit(): void {
    this.authoringService.getCategories(this.selectedUnitId)
      .subscribe(categories => this.categories = categories);
  }

  ngOnChanges(): void {
    this.authoringService.getByUnit(this.selectedUnitId).subscribe(reflections => {
        this.reflections = reflections;
        this.reflections.forEach(r => 
          r.questions.forEach(q => 
            q.categoryName = this.categories.find(c => c.id === q.categoryId).name));
        this.isEditing = false;
    });
  }

  add(): void {
    const newReflection: Reflection = {
      id: 0,
      order: Math.max(...this.reflections.map(i => i.order), 0) + 1,
      name: '',
      questions: getDefaultQuestions(this.categories)
    };

    this.reflections = [newReflection, ...this.reflections];
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
      category: [q.categoryId, [Validators.required]],
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
    const defaultCategory = this.categories.length ? this.categories[0]?.id : 0;

    const newQuestion: ReflectionQuestion = {
      id: 0,
      order: newIdx,
      text: '',
      categoryId: defaultCategory,
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


  clone(item: Reflection): void {
    const cloned: Reflection = JSON.parse(JSON.stringify(item));
    cloned.id = 0;
    cloned.order = Math.max(...this.reflections.map(i => i.order), 0) + 1;
    cloned.questions.forEach(q => q.id = 0);
    this.reflections.push(cloned);
    this.initForm(cloned);
  }

  delete(id: number): void {
    this.authoringService.delete(this.selectedUnitId, id).subscribe(() => {
      this.reflections = this.reflections.filter(r => r.id !== id);
    });
  }

  saveOrUpdate(): void {
    if (this.form.invalid) return;

    const finalReflection: Reflection = this.getFormData();

    if (finalReflection.id === 0) {
      this.authoringService.create(this.selectedUnitId, finalReflection).subscribe(
        newReflection => {
          const idx = this.reflections.findIndex((r) => r.id === 0);
          if (idx !== -1) this.reflections[idx] = newReflection;
          this.isEditing = false;
        },
        err => {
          console.error(err);
        }
      );
    } else {
      this.authoringService.update(this.selectedUnitId, finalReflection).subscribe(
        updatedReflection => {
          const idx = this.reflections.findIndex((r) => r.id === updatedReflection.id);
          if (idx !== -1) this.reflections[idx] = updatedReflection;
          this.isEditing = false;
        },
        err => {
          console.error('Greška prilikom ažuriranja refleksije:', err);
        }
      );
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
        categoryId: q.category,
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