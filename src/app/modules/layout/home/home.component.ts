import { Component, OnInit } from '@angular/core';
import {UnitService} from '../../domain/unit/unit.service';
import {Unit} from '../../domain/unit/unit.model';
import {Course} from '../../domain/course/course.model';
import {User} from '../../../infrastructure/auth/user.model';
import {AuthenticationService} from '../../../infrastructure/auth/auth.service';
import {LearnerService} from '../../learner/learner.service';
import {InstructorService} from '../../instructor/instructor.service';

@Component({
  selector: 'cc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  units: Unit[];
  courses: Course[];
  user: User;

  constructor(private unitService: UnitService,
              private authService: AuthenticationService,
              private learnerService: LearnerService,
              private instructorService: InstructorService) { }

  ngOnInit(): void {
    this.unitService.getUnits().subscribe(units => this.units = units);
    this.authService.user$.subscribe(user => {
      if(user == null) return;
      this.user = user;
      if (this.user.role == 'learner') {
        this.learnerService.getCourses().subscribe( courses => {
          this.courses = courses;
        });
      } else if (this.user.role == 'instructor') {
        this.instructorService.getCourses().subscribe( courses => {
          this.courses = courses;
        });
      }
    });
  }
}
