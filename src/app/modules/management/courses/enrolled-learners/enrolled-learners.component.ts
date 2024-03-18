import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { CrudService } from 'src/app/shared/generics/generic-table/crud.service';
import { BulkEnrollLearnersComponent } from '../bulk-enroll-learners/bulk-enroll-learners.component';
import { Group } from '../../model/group.model';
import { environment } from '../../../../../environments/environment';
import { Field } from 'src/app/shared/generics/model/field.model';
import { Learner } from 'src/app/modules/monitoring/model/learner.model';

@Component({
  selector: 'cc-enrolled-learners',
  templateUrl: './enrolled-learners.component.html',
  styleUrls: ['./enrolled-learners.component.scss']
})
export class EnrolledLearnersComponent implements OnChanges {
  baseUrl: string;
  @Input() group: Group;
  dataSource: MatTableDataSource<Learner>;

  fieldConfiguration: Field[] = [
    { code: 'index', type: 'string', label: 'Indeks' },
    { code: 'name', type: 'string', label: 'Ime' },
    { code: 'surname', type: 'string', label: 'Prezime' },
    { code: 'CRUD', type: 'CRUD', label: '', crud: {delete: true} }
  ];
  columns: Array<string> = ['index', 'name', 'surname', 'CRUD'];

  constructor(private dialog: MatDialog, private membershipService: CrudService<Learner>) { }

  ngOnChanges(): void {
    this.baseUrl = environment.apiHost + "management/groups/" + this.group.id + "/members/";
    this.membershipService.getAll(this.baseUrl, null).subscribe(response => {
      this.dataSource = new MatTableDataSource(response.results);
    });
  }

  onAddBulk(): void {
    const dialogRef = this.dialog.open(BulkEnrollLearnersComponent, {height: '600px', width: '900px'});

    dialogRef.afterClosed().subscribe(learners => {
      if(!learners) return;
      this.membershipService.bulkCreate(this.baseUrl, learners).subscribe(() => {
        learners = learners.filter((l: any) => !this.dataSource.data.map(e => e.index).includes(l.index));
        this.dataSource = new MatTableDataSource(this.dataSource.data.concat(learners));
      });
    });
  }

  onDelete(learnerId: number): void {
    const diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(result) {
        this.membershipService.delete(this.baseUrl, learnerId).subscribe(() =>
          this.dataSource = new MatTableDataSource(this.dataSource.data.filter(e => e.id !== learnerId)));
      }
    });
  }

  trim(text: string): string {
    if(!text) return null;
    if(text.length < 18) return text;
    return text.substring(0, 16)+"...";
  }
}
