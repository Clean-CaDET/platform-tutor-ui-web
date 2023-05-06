import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CrudService } from 'src/app/shared/generics/generic-table/crud.service';
import { environment } from 'src/environments/environment';
import { BulkAccounts } from '../../../model/bulk-accounts.model';
import {CreateLearner} from '../../../model/create-learner.model';

@Component({
  selector: 'cc-bulk-add',
  templateUrl: './bulk-add.component.html',
  styleUrls: ['./bulk-add.component.scss']
})
export class BulkAddComponent implements OnInit {
  formGroup: FormGroup;
  learnerTypes: string[] = ['FTN', 'FTN Inf'];
  learners: CreateLearner[];
  checkView: boolean;
  
  dataSource: MatTableDataSource<CreateLearner>;
  displayedColumns: Array<string> = ['num', 'username', 'name', 'surname', 'email'];
  invalidEntries: string[];
  
  baseUrl = environment.apiHost + "management/learners/";
  responseView: boolean;
  responseErrorView: boolean;
  existingLearners: MatTableDataSource<CreateLearner>;
  newLearners: MatTableDataSource<CreateLearner>;
  newLearnersAdded: boolean = false;

  constructor(private builder: FormBuilder, private dialogRef: MatDialogRef<BulkAddComponent>, private learnerService: CrudService<CreateLearner>) { }

  ngOnInit(): void {
    this.formGroup = this.builder.group({
      'learnersType': new FormControl('', Validators.required),
      'learners': new FormControl('', Validators.required)
    })
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
      id: i + 1,
      num: i + 1,
      index: elements[0].trim(),
      password: elements[1].trim(),
      name: elements[2].trim(),
      surname: elements[3].trim(),
      email: elements[4].trim(),
      userType: this.formGroup.controls['learnersType'].value
    };
  }

  onBack(): void {
    this.checkView = false;
    this.responseView = false;
    this.responseErrorView = false;
  }

  onSubmit(): void {
    this.learnerService.bulkCreate(this.baseUrl, this.learners).subscribe({
      next: (data) => {
        this.responseView = true;
        this.responseErrorView = false;
        const accounts = data as BulkAccounts;
        if (accounts.newAccounts.length !== 0) this.newLearnersAdded = true;
        this.existingLearners = new MatTableDataSource(accounts.existingAccounts);
        this.newLearners = new MatTableDataSource(accounts.newAccounts);
      },
      error: (error) => {
        if (error.error.detail.includes('Duplicate username')) this.responseErrorView = true;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close(this.newLearnersAdded);
  }

  getErrorMessage(controlName: string): string {
    if(this.formGroup.controls[controlName].hasError('required')) {
      return 'Unos je obavezan.';
    }
  }
}
