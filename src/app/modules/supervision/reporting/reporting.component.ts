import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Course } from '../model/course.model';
import { Group } from '../model/group.model';
import { ReportSupervisionService } from './report-supervision.service';
import { Learner } from '../model/learner.model';
import { CourseReportDialogComponent } from './course-summary-report/course-report-dialog/course-report-dialog.component';

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

  constructor(private supervisionService: ReportSupervisionService, private dialog: MatDialog) {}
  
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
          
          // Augment reports with course data
          if (l.reports) {
            l.reports.forEach(report => {
              const course = this.courses.find(c => c.id === report.courseId);
              if (course) {
                report.courseCode = course.code;
                report.courseName = course.name;
              }
            });
          }
        });
      });
    });
  }

  hasReportFromOtherCourse(learner: Learner): boolean {
    if (!learner.reports || !this.selectedCourse?.id) return false;
    return learner.reports.some(report => report.courseId !== this.selectedCourse.id);
  }

  openOtherCourseReport(learner: Learner, event: Event): void {
    event.stopPropagation();
    
    if (!learner.reports || !this.selectedCourse?.id) return;
    
    // Get all reports from other courses
    const otherCourseReports = learner.reports.filter(report => report.courseId !== this.selectedCourse.id);
    
    if (otherCourseReports.length > 0) {
      this.dialog.open(CourseReportDialogComponent, {
        data: {
          reports: otherCourseReports,
          currentIndex: 0
        },
        width: '90vw',
        maxWidth: '1400px',
        height: '90vh',
        maxHeight: '900px'
      });
    }
  }
}
