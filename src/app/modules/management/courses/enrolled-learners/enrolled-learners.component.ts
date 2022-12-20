import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';

@Component({
  selector: 'cc-enrolled-learners',
  templateUrl: './enrolled-learners.component.html',
  styleUrls: ['./enrolled-learners.component.scss']
})
export class EnrolledLearnersComponent implements OnChanges {
  @Input() group;

  dataSource;

  fieldConfiguration = [
    { code: 'email', type: 'email', label: 'Email' },
    { code: 'name', type: 'string', label: 'Ime' },
    { code: 'surname', type: 'string', label: 'Prezime' },
    { code: 'CRUD', type: 'CRUD', label: '', delete: true }
  ];
  columns = ['email', 'name', 'surname', 'CRUD'];

  constructor(private dialog: MatDialog) { }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource();
    //TODO: Load learners
  }

  onAddBulk(): void {
    //TODO: Open dialog, on confirm add learners to list (dialog will save them)
    /*const dialogRef = this.dialog.open(GenericSelectionFormComponent);

    dialogRef.afterClosed().subscribe(learners => {
      if(!learners) return;
      this.dataSource = new MatTableDataSource(this.dataSource.data.concat(learners));
    });*/
  }

  onDelete(instructorId: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(result) {
        //this.ownersService.removeOwner(this.course.id, instructorId).subscribe(() =>
        //  this.dataSource = new MatTableDataSource(this.dataSource.data.filter(e => e.id !== instructorId)));
      }
    });
  }
}
