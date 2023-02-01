import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/generics/generic-table/crud.service';
import { Course } from '../model/course.model';
import { Group } from '../model/group.model';
import { StakeholderAccount } from '../model/stakeholder-account.model';
import { environment } from '../../../../environments/environment';
import { Field } from 'src/app/shared/generics/model/field.model';

@Component({
  selector: 'cc-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  baseUrl = environment.apiHost + 'management/courses/';
  fields: Field[] = [
    { code: 'code', type: 'string', label: 'Kod', required: true },
    { code: 'name', type: 'string', label: 'Naziv', required: true },
    { code: 'startDate', type: 'date', label: 'Dan početka', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', crud: {create: true, clone: true, update: true, archive: true, delete: true, filter: true} }
  ];
  selectedCourse: Course;

  baseGroupUrl: string;
  groupFields: Field[] = [
    { code: 'name', type: 'string', label: 'Naziv', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', crud: {create: true, update: true, delete: true} }
  ];
  selectedGroup: Group;
  allInstructors: StakeholderAccount[];

  constructor(private instructorService: CrudService<StakeholderAccount>) { }

  ngOnInit(): void {
    this.instructorService.getAll(environment.apiHost + 'management/instructors/', null)
      .subscribe(instructors => {
        this.allInstructors = instructors.results;
      });
  }

  onSelect(course: Course) {
    this.selectedCourse = course;
    this.selectedGroup = null;
    this.baseGroupUrl = this.baseUrl + course.id + "/groups/";
  }

  onSelectGroup(group: Group) {
    this.selectedGroup = group;
  }
}
