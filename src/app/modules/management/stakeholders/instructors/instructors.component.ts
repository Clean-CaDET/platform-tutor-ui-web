import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/generics/generic-table/crud.service';

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
    { code: 'CRUD', type: 'CRUD', label: '', create: true, update: true, archive: true, delete: true, filter: true }
  ];

  selectedInstructor: any;
  allCourses: any[];
  
  // TODO: Where do the courseService and related interfaces belong?
  constructor(private courseService: CrudService<any>) { }

  ngOnInit(): void {
    this.courseService.getAll('https://localhost:44333/api/management/courses/', null)
      .subscribe(courses => this.allCourses = courses.results);
  }

  onSelect(selectedInstructor) {
    if(!selectedInstructor) return;
    this.selectedInstructor = selectedInstructor;
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