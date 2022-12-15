import { Component } from '@angular/core';

@Component({
  selector: 'cc-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})
export class InstructorsComponent {
  baseUrl = 'https://localhost:44333/api/management/instructors/';
  // Should add an interface/class for each field and separate CRUD operations into a different structure?
  fields = [
    {
      code: 'email',
      type: 'email',
      label: 'Email / Username',
      required: true
    },
    {
      code: 'password',
      type: 'password',
      label: 'Lozinka'
    },
    {
      code: 'name',
      type: 'string',
      label: 'Ime',
      required: true
    },
    {
      code: 'surname',
      type: 'string',
      label: 'Prezime',
      required: true
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

interface Instructor {
  id: number,
  index: string,
  name: string,
  surname: string,
  email: string,
  password: string
}