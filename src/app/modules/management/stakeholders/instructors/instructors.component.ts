import { Component } from '@angular/core';
import { InstructorsService } from './instructors.service';

@Component({
  selector: 'cc-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})
export class InstructorsComponent {
  baseUrl = 'https://localhost:44333/api/management/instructors/';
  // Should add an interface/class for each field and separate CRUD operations into a different structure?
  instructorFields = [
    { code: 'email', type: 'email', label: 'Email / Username', required: true },
    { code: 'password', type: 'password', label: 'Lozinka' },
    { code: 'name', type: 'string', label: 'Ime', required: true },
    { code: 'surname', type: 'string', label: 'Prezime', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', create: true, update: true, archive: true, delete: true }
  ];

  courseFields = [
    { code: 'code', type: 'string', label: 'Šifra' },
    { code: 'name', type: 'string', label: 'Naziv' },
    { code: 'CRUD', type: 'CRUD', label: '', delete: true }
  ];

  ownedCourses: any;
  selectedInstructor: any;
  
  constructor(private httpService: InstructorsService) { }

  onSelect(selectedInstructor) {
    if(!selectedInstructor) return;
    this.selectedInstructor = selectedInstructor;
    this.httpService.getOwnedCourses(selectedInstructor.id).subscribe(response => {
      this.ownedCourses = response;
    })
  }

  removeOwnedCourse(courseId: number) {
    if(!this.selectedInstructor) return;
    this.httpService.removeOwnedCourse(this.selectedInstructor.id, courseId).subscribe(() => {
      this.ownedCourses = this.ownedCourses.filter(o => o.id != courseId);
    });
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