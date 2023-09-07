import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CcqItem, CodeCompletionQuestion } from '../model/ccq.model';

@Component({
  selector: 'cc-ccq-form',
  templateUrl: './ccq-form.component.html',
  styleUrls: ['./ccq-form.component.scss']
})
export class CcqFormComponent implements OnInit {
  @Input() item: CodeCompletionQuestion;
  workingItem: CodeCompletionQuestion;
  @Output() saveChanges = new EventEmitter<CodeCompletionQuestion>();

  form: FormGroup

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.workingItem = JSON.parse(JSON.stringify(this.item));
    
    this.form = this.builder.group({
      code: [this.item.code ? this.combineCodeAndCcqItems(this.item) : '', Validators.required],
      feedback: [this.item.feedback ? this.item.feedback : '', Validators.required],
      hints: this.builder.array([])
    });

    this.workingItem.hints?.forEach(hint => this.addHint(hint));
  }

  get hints(): FormArray {
    return this.form.controls["hints"] as FormArray;
  };

  private combineCodeAndCcqItems(item: CodeCompletionQuestion): string {
    let code = item.code;
    item.items.forEach(i => {
      code = code.replace(`$$${i.order}$$`, `$$$${i.answer}$$$${i.ignoreSpace}$$$`);
    });
    console.log(code);
    return code;
  }

  updateText(text: string): void {
    this.workingItem.text = text;
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
    let itemsAndCode = this.extractItemsAndClearCode(this.form.value['code']);
    this.workingItem.code = itemsAndCode.clearedCode;
    this.workingItem.items = itemsAndCode.items;
    this.workingItem.feedback = this.form.value['feedback'];
    this.workingItem.hints = this.form.value['hints'].map((o: any) => o['text']);
    this.saveChanges.emit(this.workingItem);
  }

  private extractItemsAndClearCode(input: string) {
    // Pattern $$correct_answer$$ignore_space_flag$$
    const regex = /\$\$(.*?)\$\$(.*?)\$\$/g;
    
    let items: CcqItem[] = [];
    let order = 0;
    const clearedCode = input.replace(regex, (_match, p1, p2) => {
      order++;
      items.push(new CcqItem({
        answer: p1,
        ignoreSpace: p2 === 'true',
        length: p1.length,
        order
      }));
      return `$$${order}$$`;
    });
    
    return { items, clearedCode };
  }

  cancel(): void {
    this.saveChanges.emit(null);
  }
}
