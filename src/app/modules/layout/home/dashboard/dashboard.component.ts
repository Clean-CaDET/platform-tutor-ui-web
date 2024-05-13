import { Component, Input } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/user.model';
import { Course } from 'src/app/modules/learning/model/course.model';

@Component({
  selector: 'cc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @Input() user: User;
  @Input() courses: Course[];

  constructor() {}
}
