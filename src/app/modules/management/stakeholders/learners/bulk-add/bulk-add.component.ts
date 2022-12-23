import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'cc-bulk-add',
  templateUrl: './bulk-add.component.html',
  styleUrls: ['./bulk-add.component.scss']
})
export class BulkAddComponent implements OnInit {
  formGroup: FormGroup;
  learners: any[];
  checkView: boolean;

  dataSource;
  displayedColumns = ['num', 'username', 'name', 'surname', 'email'];
  invalidEntries: string[];

  constructor(private builder: FormBuilder, private dialogRef: MatDialogRef<BulkAddComponent>) { }

  ngOnInit(): void {
    this.formGroup = this.builder.group({'learners': new FormControl('', Validators.required)})
  }

  onCheck() {
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

      this.learners.push({
        num: i+1,
        index: elements[0].trim(),
        password: elements[1].trim(),
        name: elements[2].trim(),
        surname: elements[3].trim(),
        email: elements[4].trim()
      });
    }

    this.dataSource = new MatTableDataSource(this.learners);
    this.checkView = true;
  }

  onBack() {
    this.checkView = false;
  }

  onSubmit() {
    this.dialogRef.close(this.learners);
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
