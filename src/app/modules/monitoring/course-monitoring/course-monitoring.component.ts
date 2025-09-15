import { Component, OnInit } from '@angular/core';
import { Course } from '../../management/model/course.model';
import { Group } from '../model/group.model';
import { CourseMonitoringService } from './course-monitoring.service';
import { AuthenticationService } from 'src/app/infrastructure/auth/auth.service';
import { WeeklyFeedback } from '../weekly-feedback/weekly-feedback.model';
import { Learner } from '../model/learner.model';
import { WeeklyFeedbackQuestion } from '../weekly-feedback/weekly-feedback-questions.service';
import { Reflection } from '../../learning/reflection/reflection.model';

@Component({
  selector: 'cc-course-monitoring',
  templateUrl: './course-monitoring.component.html',
  styleUrl: './course-monitoring.component.scss'
})
export class CourseMonitoringComponent implements OnInit {
  courses: Course[];
  selectedCourseId: 0;
  groups: Group[];
  isInstructor: boolean;
  selectedLearner: Learner;
  feedbackQuestions: WeeklyFeedbackQuestion[];
  loadedReflections: Reflection[];
  selectedFeedback: WeeklyFeedback;

  constructor(private monitoringService: CourseMonitoringService, private authService: AuthenticationService) {}
  
  ngOnInit(): void {
    const user = this.authService.user$.value;
    this.isInstructor = user.role === 'instructor';
    this.monitoringService.GetActiveCourses(this.isInstructor).subscribe(courses => this.courses = courses);
    this.monitoringService.GetFeedbackQuestions().subscribe(qs => this.feedbackQuestions = qs);
  }

  getGroups(): void {
    this.selectLearner(null);
    this.monitoringService.GetCourseGroups(this.selectedCourseId, this.isInstructor).subscribe(groups => {
      this.groups = groups;
      this.groups.forEach(g => {
        g.learners.sort((l1, l2) => l1.name > l2.name ? 1 : -1);
        g.learners.forEach(l => {
          if(l.index.indexOf('@') > 0) l.index = l.index.split('@')[0];
          l.recentFeedback = l.weeklyFeedback?.slice(0, 3) ?? [];
          l.recentFeedback.forEach(f => {
            if(f.opinions) f.opinions = JSON.parse(f.opinions.toString());
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
    if(numbers.length == 2) return 0.6 * numbers[0] + 0.4 * numbers[1];
    return 0.5 * numbers[0] + 0.33 * numbers[1] + 0.17 * numbers[2];
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

  getQuestion(code: string): string {
    return this.feedbackQuestions.find(q => q.code === code).question ?? "";
  }

  selectLearner(learner: Learner): void {
    this.selectedLearner = learner;
    this.loadedReflections = null;
    this.selectedFeedback = null;
  }

  showReflections(feedback: WeeklyFeedback): void {
    if (!feedback.learnerId || !feedback.reflectionIds?.length) return;
    
    this.selectedFeedback = feedback;
    this.monitoringService.GetReflections(feedback.learnerId, feedback.reflectionIds).subscribe(reflections => {
      reflections.forEach(r => {
        r.selectedLearnerSubmission = r.submissions.find(s => s.learnerId === feedback.learnerId);
        r.questions = r.questions.filter(q => q.category != 2); // Ignore reflections on materials
        r.questions.forEach(q => q.answer = r.selectedLearnerSubmission?.answers.find(a => a.questionId === q.id)?.answer);
      });
      this.loadedReflections = reflections;
    });
  }
}