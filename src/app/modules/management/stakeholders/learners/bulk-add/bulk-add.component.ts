import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FieldOption } from 'src/app/shared/generics/model/field-option';
import { environment } from 'src/environments/environment';
import { LearnersService } from '../../../courses/learners.service';
import {CreateLearner} from '../../../model/create-learner.model';

@Component({
  selector: 'cc-bulk-add',
  templateUrl: './bulk-add.component.html',
  styleUrls: ['./bulk-add.component.scss']
})
export class BulkAddComponent implements OnInit {
  formGroup: FormGroup;
  learnerTypes: FieldOption[] = [{label: 'FTN', value: 'regular'}, {label: 'FTN Inf', value: 'commercial'}];
  learners: CreateLearner[];
  checkView: boolean;
  
  dataSource: MatTableDataSource<CreateLearner>;
  displayedColumns: Array<string> = ['num', 'username', 'name', 'surname', 'email'];
  invalidEntries: string[];
  
  baseUrl = environment.apiHost + "management/learners/";
  existingDatasource: MatTableDataSource<CreateLearner> = null;
  newLearners: CreateLearner[];

  constructor(private builder: FormBuilder, private dialogRef: MatDialogRef<BulkAddComponent>, private learnerService: LearnersService) { }

  ngOnInit(): void {
    this.formGroup = this.builder.group({
      'learnersType': new FormControl('', Validators.required),
      'learners': new FormControl('', Validators.required)
    })
  }

  onCheck(): void {
    this.createLearnerList()
    this.checkView = true;
    
    this.learnerService.getLearners(this.learners.map(l => l.index)).subscribe((data) => {
      if (data.totalCount === 0) {
        this.dataSource = new MatTableDataSource(this.learners);
        return;
      }

      const existingUsernames = data.results.map(a => a.index);
      let existingLearners: CreateLearner[] = [];
      this.newLearners = [];
      this.learners.forEach(learner => {
        if (existingUsernames.includes(learner.index))
          existingLearners.push(learner);
        else
          this.newLearners.push(learner);
      })
      this.existingDatasource = new MatTableDataSource(existingLearners);
      this.dataSource = new MatTableDataSource(this.newLearners);
    });

  }

  private createLearnerList() {
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

      if (this.learners.findIndex(l => l.index === elements[0].trim()) !== -1)
        continue;
      this.learners.push(this.createLearner(i, elements));
    }
  }

  private createLearner(i: number, elements: string[]): CreateLearner {
    return {
      id: i + 1,
      num: i + 1,
      index: elements[0].trim(),
      password: elements[1].trim(),
      name: elements[2].trim(),
      surname: elements[3].trim(),
      email: elements[4].trim(),
      learnerType: this.formGroup.controls['learnersType'].value
    };
  }

  onBack(): void {
    this.checkView = false;
  }

  onSubmit(): void {
    this.dialogRef.close(this.newLearners);
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(controlName: string): string {
    if(this.formGroup.controls[controlName].hasError('required')) {
      return 'Unos je obavezan.';
    }
  }
}
