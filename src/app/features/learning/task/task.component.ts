import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { debounceTime, fromEvent, forkJoin, switchMap } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { YouTubePlayer } from '@angular/youtube-player';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';
import { CanComponentDeactivate } from '../../../core/confirm-exit.guard';
import { getRouteParams, onNavigationEnd } from '../../../core/route.util';
import { TaskService } from './task.service';
import { TaskProgressService } from './task-progress.service';
import { LearningTask } from './model/learning-task.model';
import { Activity } from './model/activity.model';
import { ActivityExample } from './model/activity-example.model';
import { TaskProgress } from './model/task-progress.model';
import { SubactivitiesComponent } from './subactivities/subactivities.component';

@Component({
  selector: 'cc-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatTabsModule,
    MatDividerModule, MatFormFieldModule, MatInputModule, MatTooltipModule,
    YouTubePlayer, CcMarkdownComponent, SubactivitiesComponent,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  animations: [
    trigger('expandCollapseDefinition', [
      state('state0', style({ height: '100%' })),
      state('state1', style({ height: '70px' })),
      state('state2', style({ height: '50%' })),
      state('state3', style({ height: 'calc(100% - 70px)' })),
      state('disabled', style({})),
      transition('* <=> *', animate('0.3s ease-in-out')),
    ]),
    trigger('expandCollapseContent', [
      state('state0', style({ height: '0px' })),
      state('state1', style({ height: 'calc(100% - 70px)' })),
      state('state2', style({ height: '50%' })),
      state('state3', style({ height: '70px' })),
      state('disabled', style({})),
      transition('* <=> *', animate('0.3s ease-in-out')),
    ]),
  ],
})
export class TaskComponent implements CanComponentDeactivate {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly title = inject(Title);
  private readonly builder = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly progressService = inject(TaskProgressService);

  readonly task = signal<LearningTask | null>(null);
  readonly steps = signal<Activity[]>([]);
  readonly taskProgress = signal<TaskProgress | null>(null);
  readonly selectedStep = signal<Activity | null>(null);
  readonly selectedStepIndex = computed(() => {
    const step = this.selectedStep();
    return step ? this.steps().findIndex(s => s.code === step.code) : 0;
  });
  readonly sliderPosition = signal(0);
  readonly isWideScreen = signal(false);
  readonly viewingTab = signal('');
  readonly videoUrl = signal('');
  readonly selectedExample = signal<ActivityExample | null>(null);
  protected courseId: number;

  answerForm!: FormGroup;
  selectedTab = new FormControl(0);

  private videoPlaybackStatus = 0;
  private videoEventDelayerId = 0;

  constructor() {
    this.isWideScreen.set(window.innerWidth >= 1600);

    fromEvent(window, 'resize').pipe(
      debounceTime(150),
      takeUntilDestroyed(),
    ).subscribe(() => this.isWideScreen.set(window.innerWidth >= 1600));

    this.destroyRef.onDestroy(() => clearTimeout(this.videoEventDelayerId));

    const params = getRouteParams(this.route);
    this.courseId = +params['courseId'];
    this.loadTask(+params['unitId'], +params['taskId']);

    onNavigationEnd((_url, p) => {
      this.courseId = +p['courseId'];
      this.loadTask(+p['unitId'], +p['taskId']);
    });
  }

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges()) {
      return confirm('Niste sačuvali izmenu odgovora ili napomene mentoru.\nDa li odustajete od izmene?');
    }
    return true;
  }

  start(): void {
    this.sliderPosition.set(2);
    const allSteps = this.steps();
    if (allSteps.length) {
      this.viewStep(allSteps[0]);
    }
  }

  viewStep(step: Activity): void {
    if (!step) return;
    if (this.hasUnsavedChanges()) {
      if (!confirm('Niste sačuvali izmenu odgovora ili napomene mentoru.\nDa li odustajete od izmene?')) return;
    }
    this.prepareStepView(step);
    const progress = this.taskProgress()!;
    const task = this.task()!;
    if (step.progress.status === 'Graded') {
      this.viewingTab.set('Results');
      return;
    }
    this.viewingTab.set('Submission');
    this.progressService.viewStep(task.unitId!, task.id!, progress.id!, step.id!).pipe(
      switchMap(updatedProgress => {
        this.taskProgress.set(updatedProgress);
        return this.progressService.submissionOpened(task.unitId!, task.id!, updatedProgress.id!, step.id!);
      }),
    ).subscribe();
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    const task = this.task()!;
    const progress = this.taskProgress()!;
    const step = this.selectedStep()!;
    const label = tabChangeEvent.tab.textLabel;

    if (label === 'Slanje rešenja') {
      this.progressService.submissionOpened(task.unitId!, task.id!, progress.id!, step.id!).subscribe();
      this.viewingTab.set('Submission');
    } else if (label === 'Smernice') {
      this.progressService.guidanceOpened(task.unitId!, task.id!, progress.id!, step.id!).subscribe();
      this.viewingTab.set('Guidelines');
    } else if (label === 'Primeri') {
      this.progressService.exampleOpened(task.unitId!, task.id!, progress.id!, step.id!).subscribe();
      this.viewingTab.set('Examples');
    } else if (label === 'Rezultat') {
      this.viewingTab.set('Results');
    }
  }

  submitAnswer(): void {
    const step = this.selectedStep()!;
    step.progress.answer = this.answerForm.get('answer')!.value;
    step.progress.commentForMentor = this.answerForm.get('commentForMentor')!.value;
    const task = this.task()!;
    const progress = this.taskProgress()!;
    this.progressService.submitAnswer(task.unitId!, task.id!, progress.id!, step.progress)
      .subscribe(updatedProgress => this.taskProgress.set(updatedProgress));
  }

  getNextExample(): void {
    const step = this.selectedStep()!;
    const examples = step.examples!;
    let index = examples.indexOf(this.selectedExample()!);
    if (index !== examples.length - 1) {
      this.selectedExample.set(examples[index + 1]);
    } else {
      this.selectedExample.set(examples[0]);
    }
    this.videoUrl.set(this.selectedExample()!.url.split('/').pop()!.slice(-11));
  }

  onVideoStatusChanged(event: { data: number; videoUrl?: string }): void {
    window.clearTimeout(this.videoEventDelayerId);
    this.videoEventDelayerId = window.setTimeout(() => this.sendVideoEvent(event), 300);
  }

  getPoints(standardId: number): number {
    const evaluation = this.selectedStep()!.progress.evaluations!.find(e => e.standardId === standardId);
    return evaluation!.points;
  }

  getComment(standardId: number): string {
    const evaluation = this.selectedStep()!.progress.evaluations!.find(e => e.standardId === standardId);
    return evaluation!.comment;
  }

  private loadTask(unitId: number, taskId: number): void {
    if (!unitId || !taskId) return;

    forkJoin([
      this.taskService.get(unitId, taskId),
      this.progressService.get(unitId, taskId),
    ]).subscribe(([task, progress]) => {
      this.mapSubactivities(task.steps!);
      this.task.set(task);
      this.title.setTitle(`${task.name} - Tutor`);

      const topLevelSteps = task.steps!
        .filter(s => !s.parentId)
        .sort((a, b) => a.order - b.order)
        .map(step => ({
          ...step,
          progress: progress.stepProgresses!.find(p => p.stepId === step.id)!,
        }));
      this.steps.set(topLevelSteps);
      this.taskProgress.set(progress);

      const suitableStep = this.selectSuitableStep(topLevelSteps, progress);
      if (suitableStep) {
        this.sliderPosition.set(2);
        this.viewStep(suitableStep);
      }
    });
  }

  private mapSubactivities(activities: Activity[]): void {
    for (const activity of activities) {
      activity.subactivities = [];
      for (const subactivity of activities) {
        if (subactivity.parentId === activity.id) {
          activity.subactivities.push(subactivity);
        }
      }
      activity.subactivities.sort((s1, s2) => s1.order - s2.order);
    }
  }

  private selectSuitableStep(steps: Activity[], progress: TaskProgress): Activity | null {
    if (!steps.length) return null;
    if (progress.stepProgresses!.every(p => p.status === 'Initialized')) return null;

    const firstUnanswered = steps.find(s => {
      const p = progress.stepProgresses!.find(sp => sp.stepId === s.id);
      return !p?.answer;
    });
    return firstUnanswered ?? steps[0];
  }

  private prepareStepView(step: Activity): void {
    if (step.standards) {
      step = { ...step, standards: [...step.standards].sort((a, b) => a.name > b.name ? 1 : -1) };
    }
    this.selectedStep.set(step);
    this.selectedTab.setValue(0);
    if (step.examples?.length) {
      this.selectedExample.set(step.examples[0]);
      this.videoUrl.set(step.examples[0].url.split('/').pop()!.slice(-11));
    }
    this.createForm(step);
  }

  private createForm(step: Activity): void {
    const regexPattern = new RegExp(step.submissionFormat.validationRule || '.*', 's');
    this.answerForm = this.builder.group({
      answer: new FormControl('', [Validators.required, Validators.pattern(regexPattern)]),
      commentForMentor: new FormControl('', []),
    });
    this.answerForm.get('answer')!.setValue(step.progress.answer);
    this.answerForm.get('commentForMentor')!.setValue(step.progress.commentForMentor);
  }

  protected hasUnsavedChanges(): boolean {
    if (!this.answerForm || !this.selectedStep()) return false;
    const currentAnswer = this.answerForm.get('answer')!.value || '';
    const currentComment = this.answerForm.get('commentForMentor')!.value || '';
    const savedAnswer = this.selectedStep()!.progress.answer || '';
    const savedComment = this.selectedStep()!.progress.commentForMentor || '';
    return currentAnswer !== savedAnswer || currentComment !== savedComment;
  }

  private sendVideoEvent(event: { data: number; videoUrl?: string }): void {
    if (event.data > 2) return;
    if (event.data === this.videoPlaybackStatus) return;
    this.videoPlaybackStatus = event.data;

    const task = this.task()!;
    const progress = this.taskProgress()!;
    const stepId = this.selectedStep()!.id!;
    const url = event.videoUrl || this.videoUrl();

    if (event.data === 0) {
      this.progressService.exampleVideoFinished(task.unitId!, task.id!, progress.id!, stepId, url).subscribe();
    } else if (event.data === 1) {
      this.progressService.exampleVideoPlayed(task.unitId!, task.id!, progress.id!, stepId, url).subscribe();
    } else if (event.data === 2) {
      this.progressService.exampleVideoPaused(task.unitId!, task.id!, progress.id!, stepId, url).subscribe();
    }
  }
}
