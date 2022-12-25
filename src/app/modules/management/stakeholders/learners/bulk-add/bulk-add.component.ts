import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {CreateLearner} from '../../../model/create-learner';

@Component({
  selector: 'cc-bulk-add',
  templateUrl: './bulk-add.component.html',
  styleUrls: ['./bulk-add.component.scss']
})
export class BulkAddComponent implements OnInit {
  formGroup: FormGroup;
  learners: CreateLearner[];
  checkView: boolean;

  dataSource: MatTableDataSource<CreateLearner>;
  displayedColumns: Array<string> = ['num', 'username', 'name', 'surname', 'email'];
  invalidEntries: string[];

  constructor(private builder: FormBuilder, private dialogRef: MatDialogRef<BulkAddComponent>) { }

  ngOnInit(): void {
    this.formGroup = this.builder.group({'learners': new FormControl('', Validators.required)})
  }

  onCheck(): void {
    const learnerEntries: string[] = this.formGroup.value['learners'].split('\n');
    this.invalidEntries = [];
    this.learners = [];

    for(let i = 0; i < learnerEntries.length; i++) {
      if(learnerEntries[i].trim() === '') continue;

      const elements = learnerEntries[i].split(',');
      if(elements.length != 5) {
        this.invalidEntries.push(learnerEntries[i]);
        continue;
      }

      this.learners.push(this.createLearner(i, elements));
    }

    this.dataSource = new MatTableDataSource(this.learners);
    this.checkView = true;
  }

  private createLearner(i: number, elements: string[]): CreateLearner {
    return {
      num: i + 1,
      index: elements[0].trim(),
      password: elements[1].trim(),
      name: elements[2].trim(),
      surname: elements[3].trim(),
      email: elements[4].trim()
    };
  }

  onBack(): void {
    this.checkView = false;
  }

  onSubmit(): void {
    this.dialogRef.close(this.learners);
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
