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
      options: this.builder.array([])
    });
    this.workingItem.acceptableAnswers?.forEach(item => this.addOption(item));
    if(this.options.length == 0) this.addOption(null);
  }

  get options(): FormArray {
    return this.form.controls["options"] as FormArray;
  };

  updateText(text: string):void {
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

  save(): void {
    this.workingItem.feedback = this.form.value['feedback'];
    this.workingItem.acceptableAnswers = this.form.value['options'].map((o: any) => o['text']);
    this.saveChanges.emit(this.workingItem);
  }

  cancel(): void {
    this.saveChanges.emit(null);
  }
}
