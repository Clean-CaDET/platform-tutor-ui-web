import { Component, OnInit } from '@angular/core';
import { Course } from '../../learning/model/course.model';
import { Group } from '../model/group.model';
import { SupervisionService } from '../supervision.service';
import { Learner } from '../model/learner.model';
import { WeeklyFeedbackQuestion } from '../../monitoring/weekly-feedback/weekly-feedback-questions.service';

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
  feedbackQuestions: WeeklyFeedbackQuestion[];

  constructor(private supervisionService: SupervisionService) {}
  
  ngOnInit(): void {
    this.supervisionService.GetActiveCourses().subscribe(courses => this.courses = courses);
    this.supervisionService.GetFeedbackQuestions().subscribe(qs => this.feedbackQuestions = qs);
  }

  getGroups(): void {
    this.selectedLearner = null;
    this.supervisionService.GetCourseGroups(this.selectedCourse.id).subscribe(groups => {
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
