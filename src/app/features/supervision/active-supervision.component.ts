import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CcMarkdownComponent } from '../../shared/markdown/cc-markdown.component';
import { ActiveSupervisionService } from './active-supervision.service';
import { SupervisionCourse } from './model/course.model';
import { SupervisionGroup } from './model/group.model';
import { SupervisionLearner } from './model/learner.model';
import { WeeklyFeedback } from '../monitoring/weekly-feedback/weekly-feedback.model';
import { WeeklyFeedbackQuestion } from '../monitoring/weekly-feedback/weekly-feedback-questions.service';
import { Reflection } from '../learning/reflection/reflection.model';

@Component({
  selector: 'cc-active-supervision',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonModule,
    CcMarkdownComponent,
  ],
  templateUrl: './active-supervision.component.html',
  styleUrl: './active-supervision.component.scss',
})
export class ActiveSupervisionComponent {
  private readonly supervisionService = inject(ActiveSupervisionService);

  courses = signal<SupervisionCourse[]>([]);
  selectedCourseId = signal<number>(0);
  groups = signal<SupervisionGroup[]>([]);
  selectedLearner = signal<SupervisionLearner | null>(null);
  feedbackQuestions = signal<WeeklyFeedbackQuestion[]>([]);
  loadedReflections = signal<Reflection[] | null>(null);
  selectedFeedback = signal<WeeklyFeedback | null>(null);

  constructor() {
    this.supervisionService.getActiveCourses().subscribe(courses => this.courses.set(courses));
    this.supervisionService.getFeedbackQuestions().subscribe(qs => this.feedbackQuestions.set(qs));
  }

  getGroups(): void {
    this.selectLearner(null);
    this.supervisionService.getCourseGroups(this.selectedCourseId()).subscribe(groups => {
      groups.forEach(g => {
        g.learners?.sort((l1, l2) => l1.name > l2.name ? 1 : -1);
        g.learners?.forEach(l => {
          if (l.index.indexOf('@') > 0) l.index = l.index.split('@')[0];
          l.recentFeedback = l.weeklyFeedback?.slice(0, 3) ?? [];
          l.recentFeedback.forEach(f => {
            if (!f.maxTaskPoints) {
              f.achievedPercentage = -1;
              return;
            }
            f.achievedPercentage = +(100 * f.achievedTaskPoints! / f.maxTaskPoints).toFixed(0);
          });
          l.summarySemaphore = this.calculateSummarySemaphore(l.recentFeedback);
        });
      });
      this.groups.set(groups);
    });
  }

  calculateSummarySemaphore(recentFeedback: WeeklyFeedback[]): number {
    if (recentFeedback.length < 2) return -1;
    const semaphores = recentFeedback.map(f => f.semaphore);
    const summary = this.weighValues(semaphores);
    if (summary === -1) return -1;
    if (summary < 1.67) return 1;
    return summary < 2.3 ? 2 : 3;
  }

  weighValues(numbers: number[]): number {
    if (numbers.length === 0) return -1;
    if (numbers.length === 1) return numbers[0];
    if (numbers.length === 2) return 0.6 * numbers[0] + 0.4 * numbers[1];
    return 0.5 * numbers[0] + 0.33 * numbers[1] + 0.17 * numbers[2];
  }

  getQuestion(code: string): string {
    return this.feedbackQuestions().find(q => q.code === code)?.question ?? '';
  }

  selectLearner(learner: SupervisionLearner | null): void {
    this.selectedLearner.set(learner);
    this.loadedReflections.set(null);
    this.selectedFeedback.set(null);
  }

  showReflections(feedback: WeeklyFeedback): void {
    if (!feedback.learnerId || !feedback.reflectionIds?.length) return;

    this.selectedFeedback.set(feedback);
    this.supervisionService.getReflections(feedback.learnerId, feedback.reflectionIds).subscribe(reflections => {
      reflections.forEach(r => {
        r.selectedLearnerSubmission = r.submissions?.find(s => s.learnerId === feedback.learnerId) ?? undefined;
        r.questions = r.questions.filter(q => q.category !== 2);
        r.questions.forEach(q => q.answer = r.selectedLearnerSubmission?.answers.find(a => a.questionId === q.id)?.answer);
      });
      this.loadedReflections.set(reflections);
    });
  }
}
