import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MrqItem, MultipleReponseQuestion } from '../model/mrq.model';

@Component({
  selector: 'cc-mrq-form',
  templateUrl: './mrq-form.component.html',
  styleUrls: ['./mrq-form.component.scss']
})
export class MrqFormComponent implements OnInit {
  @Input() item: MultipleReponseQuestion;
  workingItem: MultipleReponseQuestion;
  @Output() saveChanges = new EventEmitter<MultipleReponseQuestion>();
  @Output() requestPrompt = new EventEmitter<MultipleReponseQuestion>();

  form: FormGroup

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.workingItem = JSON.parse(JSON.stringify(this.item));
    
    this.form = this.builder.group({
      options: this.builder.array([]),
      hints: this.builder.array([])
    });

    this.workingItem.items?.forEach(item => this.addOption(item));
    if(this.options.length == 0) this.addOption(null);

    this.workingItem.hints?.forEach(hint => this.addHint(hint));
  }

  get options(): FormArray {
    return this.form.controls["options"] as FormArray;
  };

  get hints(): FormArray {
    return this.form.controls["hints"] as FormArray;
  };

  updateText(text: string):void {
    this.workingItem.text = text;
  }

  addOption(item: MrqItem): void {
    const optionForm = this.builder.group({
        isCorrect: item ? item.isCorrect : false,
        text: [item ? item.text : '', Validators.required],
        feedback: item ? item.feedback : ''
    });
  
    this.options.push(optionForm);
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  addHint(item: string): void {
    const hintForm = this.builder.group({
        text: [item ? item : '', Validators.required],
    });
  
    this.hints.push(hintForm);
  }

  removeHint(index: number): void {
    this.hints.removeAt(index);
  }

  save(): void {
    this.getFormData();
    this.saveChanges.emit(this.workingItem);
  }

  private getFormData() {
    this.workingItem.items = this.form.value['options'];
    this.workingItem.hints = this.form.value['hints'].map((o: any) => o['text']);
  }

  copyPrompt() {
    this.getFormData();
    this.requestPrompt.emit(this.workingItem);
  }

  cancel(): void {
    this.saveChanges.emit(null);
  }
}
