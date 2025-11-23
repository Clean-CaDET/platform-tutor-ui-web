import { Component, Input, OnChanges } from '@angular/core';
import { Course } from '../../../learning/model/course.model';
import { Learner } from '../../model/learner.model';

@Component({
  selector: 'cc-course-summary-report',
  templateUrl: './course-summary-report.component.html',
  styleUrl: './course-summary-report.component.scss'
})
export class CourseSummaryReportComponent implements OnChanges {
  @Input() course: Course;
  @Input() learner: Learner;

  ngOnChanges(): void {
    
  }
}
