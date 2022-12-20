import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/generics/generic-table/crud.service';

@Component({
  selector: 'cc-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  baseUrl = 'https://localhost:44333/api/management/courses/';
  fields = [
    { code: 'code', type: 'string', label: 'Kod', required: true },
    { code: 'name', type: 'string', label: 'Naziv', required: true },
    { code: 'isArchived', type: 'archive', label: 'Arhiviran' },
    { code: 'CRUD', type: 'CRUD', label: '', create: true, update: true, archive: true, delete: true, filter: true }
  ];
  selectedCourse;

  baseGroupUrl;
  groupFields = [
    { code: 'name', type: 'string', label: 'Naziv', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', create: true, update: true, delete: true }
  ];
  selectedGroup;

  allInstructors;

  constructor(private instructorService: CrudService<any>) { }

  ngOnInit(): void {
    this.instructorService.getAll('https://localhost:44333/api/management/instructors/', null)
      .subscribe(instructors => {
        this.allInstructors = instructors.results
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