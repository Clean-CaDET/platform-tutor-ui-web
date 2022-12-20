import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/generics/generic-table/crud.service';

@Component({
  selector: 'cc-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})
export class InstructorsComponent implements OnInit {
  baseUrl = 'https://localhost:44333/api/management/instructors/';
  instructorFields = [
    { code: 'email', type: 'email', label: 'Email / Username', required: true },
    { code: 'password', type: 'password', label: 'Lozinka' },
    { code: 'name', type: 'string', label: 'Ime', required: true },
    { code: 'surname', type: 'string', label: 'Prezime', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', create: true, update: true, archive: true, delete: true, filter: true }
  ];

  selectedInstructor: any;
  allCourses: any[];
  
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