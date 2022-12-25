import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/generics/generic-table/crud.service';
import {StakeholderAccount} from '../../model/stakeholder-account';
import {Course} from '../../model/course';
import {environment} from '../../../../../environments/environment';
import {Field} from '../../model/field';

@Component({
  selector: 'cc-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})
export class InstructorsComponent implements OnInit {
  baseUrl = environment.apiHost + 'management/instructors/';
  instructorFields: Field[] = [
    { code: 'email', type: 'email', label: 'Email / Username', required: true },
    { code: 'password', type: 'password', label: 'Lozinka' },
    { code: 'name', type: 'string', label: 'Ime', required: true },
    { code: 'surname', type: 'string', label: 'Prezime', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', crud: {create: true, update: true, archive: true, delete: true, filter: true} }
  ];

  selectedInstructor: StakeholderAccount;
  allCourses: Course[];

  constructor(private courseService: CrudService<Course>) { }

  ngOnInit(): void {
    this.courseService.getAll(environment.apiHost + 'management/courses/', null)
      .subscribe(courses => this.allCourses = courses.results);
  }

  onSelect(selectedInstructor): void {
    if(!selectedInstructor) return;
    this.selectedInstructor = selectedInstructor;
  }
}
