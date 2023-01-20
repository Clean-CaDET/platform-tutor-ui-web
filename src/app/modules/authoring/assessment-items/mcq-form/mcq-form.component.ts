import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MultipleChoiceQuestion } from '../model/mcq.model';

@Component({
  selector: 'cc-mcq-form',
  templateUrl: './mcq-form.component.html',
  styleUrls: ['./mcq-form.component.scss']
})
export class McqFormComponent implements OnInit {
  @Input() item: MultipleChoiceQuestion;
  workingItem: MultipleChoiceQuestion;
  @Output() saveChanges = new EventEmitter<MultipleChoiceQuestion>();

  form: FormGroup

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.workingItem = JSON.parse(JSON.stringify(this.item));
    
    this.form = this.builder.group({
      correctAnswer: [this.item.correctAnswer ? this.item.correctAnswer : '', Validators.required],
      feedback: [this.item.feedback ? this.item.feedback : '', Validators.required],
      options: this.builder.array([])
    });
    this.workingItem.possibleAnswers?.filter(i => i !== this.item.correctAnswer)
      .forEach(item => this.addOption(item));
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
    this.workingItem.correctAnswer = this.form.value['correctAnswer'];
    this.workingItem.feedback = this.form.value['feedback'];
    this.workingItem.possibleAnswers = this.form.value['options'].map((o: any) => o['text']);
    this.workingItem.possibleAnswers.unshift(this.form.value['correctAnswer']);
    this.saveChanges.emit(this.workingItem);
  }

  cancel(): void {
    this.saveChanges.emit(null);
  }
}
