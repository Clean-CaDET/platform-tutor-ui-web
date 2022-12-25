import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { GenericSelectionFormComponent } from 'src/app/shared/generics/generic-selection-form/generic-selection-form.component';
import { CoursesService } from '../courses.service';
import {Course} from '../../model/course';
import {StakeholderAccount} from '../../model/stakeholder-account';
import { Field } from 'src/app/shared/generics/model/field';

@Component({
  selector: 'cc-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss']
})
export class OwnersComponent implements OnChanges {
  @Input() course: Course;
  @Input() allInstructors: StakeholderAccount[];
  dataSource: MatTableDataSource<StakeholderAccount>;

  fieldConfiguration: Field[] = [
    { code: 'email', type: 'email', label: 'Email' },
    { code: 'name', type: 'string', label: 'Ime' },
    { code: 'surname', type: 'string', label: 'Prezime' },
    { code: 'CRUD', type: 'CRUD', label: '', crud: {delete: true} }
  ];
  columns: Array<string> = ['email', 'name', 'surname', 'CRUD'];

  constructor(private ownersService: CoursesService,
    private dialog: MatDialog) { }

  ngOnChanges(): void {
    this.ownersService.getOwners(this.course.id).subscribe(response => {
      this.dataSource = new MatTableDataSource(response);
    })
  }

  onAddOwner(): void {
    const dialogRef = this.dialog.open(GenericSelectionFormComponent, {
      data: {items: this.findNotOwners(), presentationFunction: (instructor: StakeholderAccount) => instructor.email + ", " + instructor.name + ", " + instructor.surname},
    });

    dialogRef.afterClosed().subscribe(instructor => {
      if(!instructor) return;
      this.ownersService.addOwner(this.course.id, instructor.id).subscribe(() => {
        this.dataSource.data.push(instructor);
        this.dataSource._updateChangeSubscription();
      });
    });
  }

  onDelete(instructorId: number): void {
    const diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(result) {
        this.ownersService.removeOwner(this.course.id, instructorId).subscribe(() =>
          this.dataSource = new MatTableDataSource(this.dataSource.data.filter(e => +e.id !== instructorId)));
      }
    });
  }

  findNotOwners(): StakeholderAccount[] {
    return this.allInstructors.filter(i => !this.dataSource.data.find(o => o.id === i.id));
  }

}
