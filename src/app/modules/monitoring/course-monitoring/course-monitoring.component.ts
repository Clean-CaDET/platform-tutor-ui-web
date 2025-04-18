import { Component, OnInit } from '@angular/core';
import { Course } from '../../management/model/course.model';
import { Group } from '../model/group.model';
import { CourseMonitoringService } from './course-monitoring.service';
import { WeeklyFeedback } from '../weekly-feedback/weekly-feedback.model';

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
          if(l.index.indexOf('@') > 0) l.index = l.index.split('@')[0];
          l.recentFeedback = l.weeklyFeedback?.slice(-3) ?? [];
          l.recentFeedback.forEach(f => {
            if(!f.maxTaskPoints) {
              f.achievedPercentage = -1;
              return;
            }
            f.achievedPercentage = +(100 * f.achievedTaskPoints / f.maxTaskPoints).toFixed(0);
          });
          l.summarySemaphore = this.calculateSummarySemaphore(l.recentFeedback);
        });
      });
    });
  }

  calculateSummarySemaphore(recentFeedback: WeeklyFeedback[]): number {
    if(recentFeedback.length < 2) return -1;

    let semaphores: number[] = [];
    let satisfactions: number[] = [];
    let scores: number[] = [];

    recentFeedback.forEach(feedback => {
      semaphores.push(feedback.semaphore);
      if(feedback.averageSatisfaction) satisfactions.push(feedback.averageSatisfaction);
      if(feedback.achievedPercentage != -1) scores.push(feedback.achievedPercentage);
    });

    return this.calculateSemaphoreWithKeyMetrics(this.weighValues(semaphores), this.weighValues(satisfactions), this.weighValues(scores));
  }

  weighValues(numbers: number[]): number {
    if(numbers.length == 0) return -1;
    if(numbers.length == 1) return numbers[0];
    if(numbers.length == 2) return 0.6 * numbers[1] + 0.4 * numbers[0];
    return 0.5 * numbers[2] + 0.33 * numbers[1] + 0.17 * numbers[0];
  }

  calculateSemaphoreWithKeyMetrics(semaphore: number, satisfaction: number, score: number): number {
    if(score == -1) return -1;
    if(semaphore < 1.67 || satisfaction < 2 || score < 34) return 1;
    
    let blueCount = 0;
    if(score > 67) blueCount++;
    if(satisfaction >= 2.6) blueCount++;
    if(semaphore > 2.3) blueCount++;
    return blueCount < 2 ? 2 : 3;
  }
}