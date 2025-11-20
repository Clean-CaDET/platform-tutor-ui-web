import { Component, OnInit } from '@angular/core';
import { Course } from '../../management/model/course.model';
import { Group } from '../../monitoring/model/group.model';
import { SupervisionService } from '../supervision.service';
import { WeeklyFeedback } from '../../monitoring/weekly-feedback/weekly-feedback.model';
import { Learner } from '../../monitoring/model/learner.model';
import { WeeklyFeedbackQuestion } from '../../monitoring/weekly-feedback/weekly-feedback-questions.service';
import { Reflection } from '../../learning/reflection/reflection.model';

@Component({
  selector: 'cc-course-supervision',
  templateUrl: './course-supervision.component.html',
  styleUrl: './course-supervision.component.scss'
})
export class CourseSupervisionComponent implements OnInit {
  courses: Course[];
  selectedCourseId: 0;
  groups: Group[];
  selectedLearner: Learner;
  feedbackQuestions: WeeklyFeedbackQuestion[];
  loadedReflections: Reflection[];
  selectedFeedback: WeeklyFeedback;

  constructor(private supervisionService: SupervisionService) {}
  
  ngOnInit(): void {
    this.supervisionService.GetActiveCourses().subscribe(courses => this.courses = courses);
    this.supervisionService.GetFeedbackQuestions().subscribe(qs => this.feedbackQuestions = qs);
  }

  getGroups(): void {
    this.selectLearner(null);
    this.supervisionService.GetCourseGroups(this.selectedCourseId).subscribe(groups => {
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

    recentFeedback.forEach(feedback => {
      semaphores.push(feedback.semaphore);
    });

    let summarySemaphore: number = this.weighValues(semaphores);
    
    if(summarySemaphore == -1) return -1;
    if(summarySemaphore < 1.67) return 1;
    return summarySemaphore < 2.3 ? 2 : 3;
  }

  weighValues(numbers: number[]): number {
    if(numbers.length == 0) return -1;
    if(numbers.length == 1) return numbers[0];
    if(numbers.length == 2) return 0.6 * numbers[0] + 0.4 * numbers[1];
    return 0.5 * numbers[0] + 0.33 * numbers[1] + 0.17 * numbers[2];
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
    this.supervisionService.GetReflections(feedback.learnerId, feedback.reflectionIds).subscribe(reflections => {
      reflections.forEach(r => {
        r.selectedLearnerSubmission = r.submissions.find(s => s.learnerId === feedback.learnerId);
        r.questions = r.questions.filter(q => q.category != 2); // Ignore reflections on materials
        r.questions.forEach(q => q.answer = r.selectedLearnerSubmission?.answers.find(a => a.questionId === q.id)?.answer);
      });
      this.loadedReflections = reflections;
    });
  }
}