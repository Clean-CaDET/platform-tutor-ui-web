import { Component, OnInit } from '@angular/core';
import { Course } from '../../management/model/course.model';
import { Group } from '../../monitoring/model/group.model';
import { SupervisionService } from '../supervision.service';
import { Learner } from '../../monitoring/model/learner.model';
import { WeeklyFeedbackQuestion } from '../../monitoring/weekly-feedback/weekly-feedback-questions.service';

@Component({
  selector: 'cc-reporting',
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.scss'
})
export class ReportingComponent implements OnInit {
  courses: Course[];
  selectedCourseId: 0;
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
    this.supervisionService.GetCourseGroups(this.selectedCourseId).subscribe(groups => {
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
