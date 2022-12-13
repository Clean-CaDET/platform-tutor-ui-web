import { Component } from '@angular/core';
import { CoursesService } from './courses.service';

@Component({
  selector: 'cc-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
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

  constructor(public service : CoursesService) { }

  onSelect($event) {
    console.log($event);
  }
}
