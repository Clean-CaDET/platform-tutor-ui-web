import { Component, OnInit } from '@angular/core';
import { Course } from '../../management/model/course.model';
import { Group } from '../model/group.model';
import { CourseMonitoringService } from './course-monitoring.service';

@Component({
  selector: 'cc-course-monitoring',
  templateUrl: './course-monitoring.component.html',
  styleUrl: './course-monitoring.component.scss'
})
export class CourseMonitoringComponent implements OnInit {
  courses: Course[];
  selectedCourseId: 0;
  groups: Group[];

  constructor(private monitoringService: CourseMonitoringService) {}
  
  ngOnInit(): void {
    this.monitoringService.GetActiveCourses().subscribe(courses => this.courses = courses);
  }

  getGroups(): void {
    this.monitoringService.GetCourseGroups(this.selectedCourseId).subscribe(groups => {
      this.groups = groups;
      this.groups.forEach(g => {
        g.learners.sort((l1, l2) => l1.name > l2.name ? 1 : -1);
        g.learners.forEach(l => {
          l.recentFeedback = l.weeklyFeedback?.slice(-3) ?? [];
          l.recentFeedback.forEach(f => {
            if(!f.maxTaskPoints) {
              f.achievedPercentage = -1;
              return;
            }
            f.achievedPercentage = +(100 * f.achievedTaskPoints / f.maxTaskPoints).toFixed(0);
          });
        });
      });
    });
  }
}