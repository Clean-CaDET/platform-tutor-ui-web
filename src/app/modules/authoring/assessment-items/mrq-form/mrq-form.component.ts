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

  form: FormGroup

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.workingItem = JSON.parse(JSON.stringify(this.item));
    
    this.form = this.builder.group({ options: this.builder.array([]) });
    this.workingItem.items?.forEach(item => this.addOption(item));
  }

  get options(): FormArray {
    return this.form.controls["options"] as FormArray;
  };

  updateText(text: string):void {
    this.workingItem.text = text;
  }

  addOption(item: MrqItem): void {
    const optionForm = this.builder.group({
        id: item ? item.id : null,
        isCorrect: item ? item.isCorrect : false,
        text: [item ? item.text : '', Validators.required],
        feedback: item ? item.feedback : ''
    });
  
    this.options.push(optionForm);
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  save(): void {
    this.saveChanges.emit(this.workingItem);
  }

  cancel(): void {
    this.saveChanges.emit(null);
  }
}
