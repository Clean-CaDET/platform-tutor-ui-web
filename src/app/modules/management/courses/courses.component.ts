import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/generics/generic-table/crud.service';
import {Course} from '../model/course';
import {Group} from '../model/group';
import {StakeholderAccount} from '../model/stakeholder-account';
import {environment} from '../../../../environments/environment';
import {Field} from '../model/field';

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
    { code: 'isArchived', type: 'archive', label: 'Arhiviran' },
    { code: 'CRUD', type: 'CRUD', label: '', crud: {create: true, update: true, archive: true, delete: true, filter: true} }
  ];
  selectedCourse: Course;

  baseGroupUrl: string;
  groupFields: Field[] = [
    { code: 'name', type: 'string', label: 'Naziv', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', crud: {create: true, update: true, delete: true} }
  ];
  selectedGroup: Group;
  allInstructors: StakeholderAccount[];

  constructor(private instructorService: CrudService<any>) { }

  ngOnInit(): void {
    this.instructorService.getAll(environment.apiHost + 'management/instructors/', null)
      .subscribe(instructors => {
        this.allInstructors = instructors.results;
      });
  }

  onSelect(course) {
    this.selectedCourse = course;
    this.selectedGroup = null;
    this.baseGroupUrl = this.baseUrl + course.id + "/groups/";
  }

  onSelectGroup(group) {
    this.selectedGroup = group;
  }
}
