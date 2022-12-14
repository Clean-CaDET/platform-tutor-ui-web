import { Component } from '@angular/core';
import { InstructorsService } from './instructors.service';

@Component({
  selector: 'cc-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})
export class InstructorsComponent {
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

  constructor(public service : InstructorsService) { }

  onSelect($event) {
    console.log($event);
  }

}
