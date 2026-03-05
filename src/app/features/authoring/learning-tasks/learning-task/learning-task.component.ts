import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getRouteParams, onNavigationEnd } from '../../../../core/route.util';
import { MatDialog } from '@angular/material/dialog';
import { HttpContext } from '@angular/common/http';
import { NotificationService } from '../../../../core/notification/notification.service';
import { SKIP_GLOBAL_ERROR } from '../../../../core/http/global-ui.interceptor';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LearningTask } from '../../../learning/task/model/learning-task.model';
import { Activity } from '../../../learning/task/model/activity.model';
import { LearningTasksAuthoringService } from '../learning-tasks-authoring.service';
import { DeleteFormComponent } from '../../../../shared/generics/delete-form/delete-form.component';
import { MarkdownPanelComponent } from '../../../../shared/markdown/markdown-panel/markdown-panel.component';
import { RequestStatus } from '../../../../shared/model/request-status.model';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { ActivitiesComponent } from './activities/activities.component';

@Component({
  selector: 'cc-learning-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule,
    MatProgressBarModule, ScrollingModule, RouterLink,
    TaskDetailsComponent, ActivityDetailsComponent, ActivitiesComponent,
  ],
  templateUrl: './learning-task.component.html',
  styleUrl: './learning-task.component.scss',
})
export class LearningTaskComponent {
  private readonly taskService = inject(LearningTasksAuthoringService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notify = inject(NotificationService);
  private readonly title = inject(Title);
  private readonly skipErrorCtx = new HttpContext().set(SKIP_GLOBAL_ERROR, true);

  readonly RequestStatus = RequestStatus;

  courseId = signal(0);
  unitId = signal(0);
  task = signal<LearningTask | null>(null);
  steps = signal<Activity[]>([]);
  mode = signal('task');
  selectedStep = signal<Activity | null>(null);
  subactivities = signal<Activity[]>([]);
  updateStatus = signal(RequestStatus.None);

  constructor() {
    const params = getRouteParams(this.route);
    this.courseId.set(+params['courseId']);
    this.unitId.set(+params['unitId']);
    this.loadTask(+params['ltId']);

    onNavigationEnd((_url, p) => {
      const ltId = +p['ltId'];
      if (!ltId || ltId === this.task()?.id) return;
      this.courseId.set(+p['courseId']);
      this.unitId.set(+p['unitId']);
      this.loadTask(ltId);
    });

    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      if (this.steps().length) this.processParams(params);
    });
  }

  private loadTask(ltId: number): void {
    this.taskService.get(this.unitId(), ltId).subscribe(task => {
      this.setupTaskAndActivities(task);
      this.processParams(this.route.snapshot.queryParams);
    });
  }

  private setupTaskAndActivities(task: LearningTask): void {
    this.title.setTitle(`Zadatak - ${task.name} - Tutor`);
    const linked = this.linkSubactivities(task);
    this.task.set(linked);
    this.steps.set((linked.steps ?? []).filter(s => !s.parentId).sort((a, b) => a.order - b.order));
  }

  private linkSubactivities(task: LearningTask): LearningTask {
    for (const activity of task.steps ?? []) {
      activity.subactivities = (task.steps ?? [])
        .filter(s => s.parentId === activity.id)
        .sort((s1, s2) => s1.order - s2.order);
    }
    return task;
  }

  private selectStep(step: Activity | null, mode: string): void {
    this.updateStatus.set(RequestStatus.None);
    this.selectedStep.set(step);
    this.mode.set(mode);
    if (mode === 'subactivities' && step) {
      const task = this.task()!;
      this.subactivities.set([step, ...(task.steps ?? []).filter(s => this.isDescendant(s, step.id!))]);
    }
  }

  private isDescendant(step: Activity, parentId: number): boolean {
    if (!step?.parentId) return false;
    if (step.parentId === parentId) return true;
    const parent = (this.task()?.steps ?? []).find(s => s.id === step.parentId);
    return parent ? this.isDescendant(parent, parentId) : false;
  }

  private processParams(queryParams: Record<string, string>): void {
    if (!this.steps().length) {
      this.selectStep(null, 'task');
      return;
    }
    const step = this.steps().find(s => s.id === +queryParams['step']);
    if (step) {
      this.selectStep(step, queryParams['mode']);
    } else {
      this.selectStep(null, queryParams['mode'] ?? 'task');
    }
  }

  openTask(): void {
    this.selectStep(null, 'task');
    this.router.navigate([], { queryParams: { mode: 'task' } });
  }

  previewTask(): void {
    this.dialog.open(MarkdownPanelComponent, {
      data: { markdown: this.task()?.description },
      position: { left: '85px', top: '80px' },
      maxHeight: 'calc(100vh - 80px)',
      maxWidth: '24vw',
    });
  }

  addStep(): void {
    const newStep: Activity = {
      name: '',
      code: '',
      guidance: '',
      order: this.getOrder(),
      submissionFormat: { type: 'Link', validationRule: '', guidelines: '' },
      examples: [],
      standards: [],
    };
    this.selectStep(newStep, 'guidance');
  }

  private getOrder(): number {
    const allSteps = this.task()?.steps ?? [];
    const mainSteps = allSteps.filter(s => !s.parentId);
    if (!mainSteps.length) return 1;
    return Math.max(...mainSteps.map(s => s.order)) + 1;
  }

  setParams(step: Activity, mode: string): void {
    const params = { step: String(step.id), mode };
    const currentParams = this.route.snapshot.queryParams;
    if (currentParams['step'] == String(step.id) && currentParams['mode'] === mode) {
      this.processParams(params);
      return;
    }
    this.router.navigate([], { queryParams: params });
  }

  createOrUpdateStep(step: Activity): void {
    const task: LearningTask = JSON.parse(JSON.stringify(this.task()));
    if (step.id) {
      task.steps = (task.steps ?? []).map(s => s.id === step.id ? step : s);
    } else {
      if (!step.parentId) this.selectedStep.set(step);
      task.steps = [...(task.steps ?? []), step];
    }
    this.updateTask(task);
  }

  reorder(step: Activity, index: number, up: boolean): void {
    const task: LearningTask = JSON.parse(JSON.stringify(this.task()));
    const mainSteps = (task.steps ?? []).filter(s => !s.parentId).sort((a, b) => a.order - b.order);
    const swappedIndex = up ? index - 1 : index + 1;
    [mainSteps[index].order, mainSteps[swappedIndex].order] = [mainSteps[swappedIndex].order, mainSteps[index].order];
    this.updateTask(task);
  }

  deleteStep(id: number): void {
    const dialogRef = this.dialog.open(DeleteFormComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const task: LearningTask = JSON.parse(JSON.stringify(this.task()));
      let orderCounter = 1;
      (task.steps ?? []).filter(s => s.id !== id && !s.parentId).forEach(s => {
        s.order = orderCounter++;
      });
      this.deleteActivityFromTask(task, id);
    });
  }

  deleteActivity(activityId: number): void {
    if (this.selectedStep()?.id === activityId) this.selectedStep.set(null);
    const task: LearningTask = JSON.parse(JSON.stringify(this.task()));
    this.deleteActivityFromTask(task, activityId);
  }

  private deleteActivityFromTask(task: LearningTask, activityId: number): void {
    task.steps = (task.steps ?? []).filter(s => s.id !== activityId);
    task.steps = task.steps.filter(s => !this.isDescendant(s, activityId));
    this.updateTask(task);
  }

  updateTask(task: LearningTask): void {
    this.updateStatus.set(RequestStatus.Started);
    this.taskService.update(this.unitId(), task, this.skipErrorCtx).subscribe({
      next: updatedTask => {
        this.updateStatus.set(RequestStatus.Completed);
        this.setupTaskAndActivities(updatedTask);
        const sel = this.selectedStep();
        if (sel) {
          const match = (updatedTask.steps ?? []).find(s => s.id === sel.id || s.code === sel.code);
          if (match) this.setParams(match, this.mode());
        }
      },
      error: error => {
        this.updateStatus.set(RequestStatus.Error);
        if (error.error?.status === 409) {
          this.notify.error('Greška: Aktivnost sa datim kodom već postoji u zadatku. Izmeni kod.');
        } else if (error.status === 0) {
          this.notify.error('Greška: Server nije prihvatio zahtev. Probaj da ponoviš operaciju.');
        } else {
          this.notify.error('Greška: Zahtev nije obrađen. Kod greške je: ' + (error.error?.status ?? error.status) + ' Probaj da ponoviš operaciju.');
        }
      },
    });
  }
}
