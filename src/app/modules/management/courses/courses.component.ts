import { Component } from '@angular/core';

@Component({
  selector: 'cc-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
  baseUrl = 'https://localhost:44333/api/management/courses/';

  fields = [
    {
      code: 'code',
      type: 'string',
      label: 'Kod',
      required: true
    },
    {
      code: 'name',
      type: 'string',
      label: 'Naziv',
      required: true
    },
    {
      code: 'description',
      type: 'string',
      label: 'Opis'
    },
    {
      code: 'isArchived',
      type: 'boolean',
      label: 'Arhiviran'
    },
    {
      code: 'CRUD',
      type: 'CRUD',
      label: '',
      create: true,
      update: true,
      archive: true,
      delete: true
    }
  ];

  constructor() { }

  onSelect($event) {
    console.log($event);
  }
}

interface Course {
  id: number,
  code: string,
  name: string,
  description: string,
  isArchived: boolean
}