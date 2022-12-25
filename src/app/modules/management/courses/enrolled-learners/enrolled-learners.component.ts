import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { CrudService } from 'src/app/shared/generics/generic-table/crud.service';
import { BulkEnrollLearnersComponent } from '../bulk-enroll-learners/bulk-enroll-learners.component';
import {Group} from '../../model/group';

@Component({
  selector: 'cc-enrolled-learners',
  templateUrl: './enrolled-learners.component.html',
  styleUrls: ['./enrolled-learners.component.scss']
})
export class EnrolledLearnersComponent implements OnChanges {
  baseUrl: string;
  @Input() group: Group;
  dataSource: MatTableDataSource<Group>;

  fieldConfiguration = [
    { code: 'email', type: 'email', label: 'Email' },
    { code: 'name', type: 'string', label: 'Ime' },
    { code: 'surname', type: 'string', label: 'Prezime' },
    { code: 'CRUD', type: 'CRUD', label: '', delete: true }
  ];
  columns: Array<string> = ['email', 'name', 'surname', 'CRUD'];

  constructor(private dialog: MatDialog, private groupService: CrudService<Group[]>) { }

  ngOnChanges(): void {
    this.baseUrl = "https://localhost:44333/api/management/courses/" + this.group.courseId + "/groups/";
    this.groupService.get(this.baseUrl, +this.group.courseId).subscribe(response => {
      this.dataSource = new MatTableDataSource(response);
    });
  }

  onAddBulk(): void {
    const dialogRef = this.dialog.open(BulkEnrollLearnersComponent, {height: '600px', width: '900px'});

    dialogRef.afterClosed().subscribe(learners => {
      if(!learners) return;
      this.dataSource = new MatTableDataSource(this.dataSource.data.concat(learners));
    });
  }

  onDelete(learnerId: number): void {
    const diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(result) {
        //this.ownersService.removeOwner(this.course.id, instructorId).subscribe(() =>
        //  this.dataSource = new MatTableDataSource(this.dataSource.data.filter(e => e.id !== instructorId)));
      }
    });
  }
}
