import {
  Component, ChangeDetectionStrategy, inject, signal, viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';
import { CanComponentDeactivate } from '../../../core/confirm-exit.guard';
import { getRouteParams, onNavigationEnd } from '../../../core/route.util';
import { ActivatedRoute } from '@angular/router';
import { ConceptElaborationService } from './concept-elaboration.service';
import { ConceptElaborationTask } from './model/concept-elaboration-task.model';
import { ConversationAttempt } from './model/conversation-attempt.model';
import { ElaborationAttemptHistoryComponent } from './attempt-history/elaboration-attempt-history.component';
import { ElaborationSessionComponent } from './session/elaboration-session.component';

type Mode =
  | { kind: 'loading' }
  | { kind: 'history'; task: ConceptElaborationTask; completedAttempts: ConversationAttempt[]; inProgress: ConversationAttempt | null }
  | { kind: 'session'; task: ConceptElaborationTask; inProgress: ConversationAttempt | null }
  | { kind: 'error'; message: string };

@Component({
  selector: 'cc-concept-elaboration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatDividerModule,
    CcMarkdownComponent, ElaborationAttemptHistoryComponent, ElaborationSessionComponent,
  ],
  templateUrl: './concept-elaboration.component.html',
  styleUrl: './concept-elaboration.component.scss',
})
export class ConceptElaborationComponent implements CanComponentDeactivate {
  private readonly service = inject(ConceptElaborationService);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  readonly mode = signal<Mode>({ kind: 'loading' });

  protected courseId = 0;
  protected unitId = 0;

  private readonly sessionRef = viewChild<ElaborationSessionComponent>('sessionRef');

  constructor() {
    const params = getRouteParams(this.route);
    this.courseId = +params['courseId'];
    this.unitId = +params['unitId'];
    const taskId = +params['taskId'];
    let initialLoaded = false;
    if (taskId) {
      this.loadTask(taskId);
      initialLoaded = true;
    }

    onNavigationEnd((_url, p) => {
      if (initialLoaded) { initialLoaded = false; return; }
      this.courseId = +p['courseId'];
      this.unitId = +p['unitId'];
      this.loadTask(+p['taskId']);
    });
  }

  canDeactivate(): boolean {
    if (this.mode().kind !== 'session') return true;
    const session = this.sessionRef();
    if (session && !session.isDirty()) return true;
    return confirm('Konverzacija je u toku. Ako napustiš stranicu, pokušaj ostaje neobavljen i možeš ga nastaviti kasnije.');
  }

  startSession(): void {
    const m = this.mode();
    if (m.kind !== 'history') return;
    this.mode.set({ kind: 'session', task: m.task, inProgress: null });
  }

  continueSession(): void {
    const m = this.mode();
    if (m.kind !== 'history' || !m.inProgress) return;
    this.mode.set({ kind: 'session', task: m.task, inProgress: m.inProgress });
  }

  onSessionEnded(): void {
    const m = this.mode();
    if (m.kind !== 'session') return;
    this.loadTask(m.task.id);
  }

  private loadTask(taskId: number): void {
    if (!taskId) return;
    this.mode.set({ kind: 'loading' });
    this.service.get(taskId).subscribe({
      next: task => this.setModeFromTask(task),
      error: () => this.mode.set({ kind: 'error', message: 'Elaboracija nije ispravno dobavljena.' }),
    });
  }

  private setModeFromTask(task: ConceptElaborationTask): void {
    this.title.setTitle(`${task.title} - Tutor`);
    const completedAttempts = task.attempts.filter(a => a.status !== 'InProgress');
    const inProgress = task.attempts.find(a => a.status === 'InProgress') ?? null;
    if (completedAttempts.length > 0) {
      this.mode.set({ kind: 'history', task, completedAttempts, inProgress });
    } else {
      this.mode.set({ kind: 'session', task, inProgress });
    }
  }
}
