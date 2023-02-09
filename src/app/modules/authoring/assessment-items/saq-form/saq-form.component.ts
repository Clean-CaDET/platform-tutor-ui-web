import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ShortAnswerQuestion } from '../model/saq.model';

@Component({
  selector: 'cc-saq-form',
  templateUrl: './saq-form.component.html',
  styleUrls: ['./saq-form.component.scss']
})
export class SaqFormComponent implements OnInit {
  @Input() item: ShortAnswerQuestion;
  workingItem: ShortAnswerQuestion;
  @Output() saveChanges = new EventEmitter<ShortAnswerQuestion>();

  form: FormGroup

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.workingItem = JSON.parse(JSON.stringify(this.item));
    
    this.form = this.builder.group({
      feedback: [this.item.feedback ? this.item.feedback : '', Validators.required],
      tolerance: [this.item.tolerance ? this.item.tolerance : 0, [Validators.required, Validators.min(0)]],
      options: this.builder.array([]),
      hints: this.builder.array([])
    });

    this.workingItem.acceptableAnswers?.forEach(item => this.addOption(item));
    if(this.options.length == 0) this.addOption(null);

    this.workingItem.hints?.forEach(hint => this.addHint(hint));
  }

  get options(): FormArray {
    return this.form.controls["options"] as FormArray;
  };

  get hints(): FormArray {
    return this.form.controls["hints"] as FormArray;
  };

  updateText(text: string): void {
    this.workingItem.text = text;
  }

  addOption(item: string): void {
    const optionForm = this.builder.group({
        text: [item ? item : '', Validators.required],
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
    this.workingItem.feedback = this.form.value['feedback'];
    this.workingItem.tolerance = this.form.value['tolerance'];
    this.workingItem.acceptableAnswers = this.form.value['options'].map((o: any) => o['text']);
    this.workingItem.hints = this.form.value['hints'].map((o: any) => o['text']);
    this.saveChanges.emit(this.workingItem);
  }

  cancel(): void {
    this.saveChanges.emit(null);
  }
}
