import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { GenericSelectionFormComponent } from 'src/app/shared/generics/generic-selection-form/generic-selection-form.component';
import { InstructorsService } from '../instructors.service';
import {StakeholderAccount} from '../../../model/stakeholder-account';
import {Course} from '../../../model/course';

@Component({
  selector: 'cc-owned-courses',
  templateUrl: './owned-courses.component.html',
  styleUrls: ['./owned-courses.component.scss']
})
export class OwnedCoursesComponent implements OnChanges {
  @Input() instructor: StakeholderAccount;
  @Input() allCourses: Course[];
  dataSource: MatTableDataSource<Course>;

  fieldConfiguration = [
    { code: 'code', type: 'string', label: 'Šifra' },
    { code: 'name', type: 'string', label: 'Naziv' },
    { code: 'CRUD', type: 'CRUD', label: '', delete: true }
  ];
  columns: Array<string> = ['code', 'name', 'CRUD'];

  constructor(private instructorService: InstructorsService,
    private dialog: MatDialog) { }

  ngOnChanges(): void {
    this.instructorService.getOwnedCourses(+this.instructor.id).subscribe(response => {
      this.dataSource = new MatTableDataSource(response);
    })
  }

  onAddOwnedCourse(): void {
    const dialogRef = this.dialog.open(GenericSelectionFormComponent, {
      data: {items: this.allNotOwnedCourses(), presentationFunction: (course) => course.code + ", " + course.name},
    });

    dialogRef.afterClosed().subscribe(course => {
      if(!course) return;
      this.instructorService.addOwnedCourse(+this.instructor.id, course.id).subscribe((response) => {
        this.dataSource.data.push(response);
        this.dataSource._updateChangeSubscription();
      });
    });
  }

  onDelete(courseId: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(result) {
        this.instructorService.removeOwnedCourse(+this.instructor.id, courseId).subscribe(() =>
          this.dataSource = new MatTableDataSource(this.dataSource.data.filter(e => e.id !== courseId)));
      }
    });
  }

  allNotOwnedCourses(): any {
    return this.allCourses.filter(c => !this.dataSource.data.find(o => o.id == c.id));
  }

}
