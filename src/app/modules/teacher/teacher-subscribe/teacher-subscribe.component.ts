import {Component, OnInit} from '@angular/core';
import {IndividualPlanModel} from '../models/individual-plan-model';
import {TeacherSubscribeService} from './teacher-subscribe.service';

@Component({
  selector: 'cc-teacher-subscribe',
  templateUrl: './teacher-subscribe.component.html',
  styleUrls: ['./teacher-subscribe.component.css']
})
export class TeacherSubscribeComponent implements OnInit {
  plans: IndividualPlanModel[];
  teacherId = 2;

  constructor(private teacherSubscribeService: TeacherSubscribeService) {
  }

  ngOnInit(): void {
    this.teacherSubscribeService.getIndividualPlans().toPromise().then(value => this.plans = value);
  }

  subscribe(id: number): void {
    this.teacherSubscribeService.subscribe(id, this.teacherId);
  }
}
