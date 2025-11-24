import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course.model';
import { Group } from '../model/group.model';
import { ReportSupervisionService } from './report-supervision.service';
import { Learner } from '../model/learner.model';

@Component({
  selector: 'cc-reporting',
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.scss'
})
export class ReportingComponent implements OnInit {
  courses: Course[];
  selectedCourse: Course;
  groups: Group[];
  selectedLearner: Learner;

  constructor(private supervisionService: ReportSupervisionService) {}
  
  ngOnInit(): void {
    this.supervisionService.GetStartedCourses().subscribe(courses => this.courses = courses);
  }

  getGroups(): void {
    this.selectedLearner = null;
    this.supervisionService.GetGroupedLearners(this.selectedCourse.id).subscribe(groups => {
      this.groups = groups;
      this.groups.forEach(g => {
        g.learners.sort((l1, l2) => l1.name > l2.name ? 1 : -1);
        g.learners.forEach(l => {
          if(l.index.indexOf('@') > 0) l.index = l.index.split('@')[0];
        });
      });
    });
  }
}
