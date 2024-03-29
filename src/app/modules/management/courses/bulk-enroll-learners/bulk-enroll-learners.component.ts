import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BulkAddComponent } from '../../stakeholders/learners/bulk-add/bulk-add.component';
import { StakeholderAccount } from '../../model/stakeholder-account.model';
import { LearnersService } from '../learners.service';

@Component({
  selector: 'cc-bulk-enroll-learners',
  templateUrl: './bulk-enroll-learners.component.html',
  styleUrls: ['./bulk-enroll-learners.component.scss']
})
export class BulkEnrollLearnersComponent implements OnInit {
  formGroup: FormGroup;
  learners: StakeholderAccount[];
  checkView: boolean;

  dataSource: MatTableDataSource<StakeholderAccount>;
  displayedColumns = ['num', 'username', 'name', 'surname', 'email'];
  missingEntries: string[];

  constructor(private builder: FormBuilder, private dialogRef: MatDialogRef<BulkAddComponent>,
    private learnerService: LearnersService) { }

  ngOnInit(): void {
    this.formGroup = this.builder.group({'learners': new FormControl('', Validators.required)})
  }

  onCheck(): void {
    const allEntries: string[] = this.getNonEmptyRows();

    this.learnerService.getLearners(allEntries).subscribe(response => {
      this.learners = response.results;
      this.missingEntries = this.determineMissingEntries(allEntries);
      this.dataSource = new MatTableDataSource(this.learners);
      this.checkView = true;
    });
  }

  private determineMissingEntries(allEntries: string[]): string[] {
    return allEntries.filter(e => !this.learners.map(l => l.index).includes(e));
  }

  private getNonEmptyRows(): string[] {
    return this.formGroup.value['learners'].split('\n').filter((e: string) => e);
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
