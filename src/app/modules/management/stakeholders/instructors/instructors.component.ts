import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericSelectionFormComponent } from 'src/app/shared/generics/generic-selection-form/generic-selection-form.component';
import { CrudService } from 'src/app/shared/generics/generic-table/crud.service';
import { InstructorsService } from './instructors.service';

@Component({
  selector: 'cc-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})
export class InstructorsComponent implements OnInit {
  baseUrl = 'https://localhost:44333/api/management/instructors/';
  // Should add an interface/class for each field and separate CRUD operations into a different structure?
  instructorFields = [
    { code: 'email', type: 'email', label: 'Email / Username', required: true },
    { code: 'password', type: 'password', label: 'Lozinka' },
    { code: 'name', type: 'string', label: 'Ime', required: true },
    { code: 'surname', type: 'string', label: 'Prezime', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', create: true, update: true, archive: true, delete: true }
  ];

  courseFields = [
    { code: 'code', type: 'string', label: 'Šifra' },
    { code: 'name', type: 'string', label: 'Naziv' },
    { code: 'CRUD', type: 'CRUD', label: '', delete: true }
  ];

  ownedCourses: any[];
  selectedInstructor: any;
  allCourses: any[];
  
  // TODO: Where do the courseService and related interfaces belong?
  constructor(private instructorService: InstructorsService,
    private courseService: CrudService<any>,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.courseService.getAll('https://localhost:44333/api/management/courses/', null)
      .subscribe(courses => this.allCourses = courses.results);
  }

  onSelect(selectedInstructor) {
    if(!selectedInstructor) return;
    this.selectedInstructor = selectedInstructor;
    this.instructorService.getOwnedCourses(selectedInstructor.id).subscribe(response => {
      this.ownedCourses = response;
    })
  }

  removeOwnedCourse(courseId: number) {
    if(!this.selectedInstructor) return;
    this.instructorService.removeOwnedCourse(this.selectedInstructor.id, courseId).subscribe(() => {
      this.ownedCourses = this.ownedCourses.filter(o => o.id != courseId);
    });
  }

  onAddOwnedCourse(): void {
    const dialogRef = this.dialog.open(GenericSelectionFormComponent, {
      data: {items: this.allNotOwnedCourses(), presentationFunction: (course) => course.code + ", " + course.name},
    });

    dialogRef.afterClosed().subscribe(course => {
      if(!course) return;
      this.instructorService.addOwnedCourse(this.selectedInstructor.id, course.id).subscribe((response) => {
        this.ownedCourses.push(response);
      });
    });
  }

  allNotOwnedCourses(): any {
    return this.allCourses.filter(c => !this.ownedCourses.find(o => o.id == c.id));
  }
}

// Should remove when this feature is done
interface Instructor {
  id: number,
  index: string,
  name: string,
  surname: string,
  email: string,
  password: string
}