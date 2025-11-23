import { Component, Input, OnChanges } from '@angular/core';
import { Course } from '../../model/course.model';
import { ReportSupervisionService } from '../report-supervision.service';
import { CourseAchievements } from '../../model/course-achievements.model';

@Component({
  selector: 'cc-course-summary-report',
  templateUrl: './course-summary-report.component.html',
  styleUrl: './course-summary-report.component.scss'
})
export class CourseSummaryReportComponent implements OnChanges {
  @Input() course: Course; //Has units and reflections
  @Input() learnerId: number;
  courseAchievements: CourseAchievements;

  constructor(private supervisionService: ReportSupervisionService) {}

  ngOnChanges(): void {
    if (!this.course?.id || !this.learnerId || !this.course.knowledgeUnits) return;
    this.courseAchievements = null;
    this.supervisionService.GetAchievements(
      this.course.id,
      this.learnerId
    ).subscribe(data => {
      this.courseAchievements = data;
      this.courseAchievements.unitAchievements.forEach(ua => {
        let relatedUnit = this.course.knowledgeUnits.find(u => u.id === ua.unitId);
        ua.unitName = relatedUnit.name;
        ua.unitOrder = relatedUnit.order;
      })
    });
  }
}
