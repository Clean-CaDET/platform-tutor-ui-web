import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ConceptElaborationStreamService } from './concept-elaboration-stream.service';
import { ConversationAttempt } from './model/conversation-attempt.model';
import { ConversationTurn } from './model/conversation-turn.model';
import { StreamChunk } from './model/stream-chunk.model';
import { AttemptStatus } from './model/attempt-status.model';

/**
 * Owns the lifecycle of a single concept-elaboration conversation: the
 * transcript, the streaming state machine (idle → thinking → streaming →
 * idle/terminal), and optimistic updates with rollback on failure.
 *
 * Scoped per host component — holds mutable per-session state and must not
 * be provided at root. Consumes `ConceptElaborationStreamService` for the
 * wire protocol and exposes semantic events (`completed$`, `reconciled$`,
 * `errored$`) so the host component can drive UX without touching chunks.
 */
@Injectable()
export class ElaborationConversationService {
  private readonly streamService = inject(ConceptElaborationStreamService);

  // Private writable signals are the source of truth for the session.
  private readonly _transcript = signal<ConversationTurn[]>([]);
  private readonly _isThinking = signal(false);
  private readonly _isStreaming = signal(false);
  private readonly _currentAttemptId = signal<number | null>(null);

  // Public `asReadonly()` / `computed()` views are what consumers bind to.
  readonly transcript = this._transcript.asReadonly();
  readonly isThinking = this._isThinking.asReadonly();
  readonly isStreaming = this._isStreaming.asReadonly();
  readonly currentAttemptId = this._currentAttemptId.asReadonly();

  // `pinnedQuestion` is the recent tutor question that the composer keeps visible while the learner types an answer;
  // during streaming it skips the in-flight System turn and falls back to the previous one.
  readonly pinnedQuestion = computed(() => {
    const turns = this._transcript();
    const streaming = this._isStreaming();
    let startIdx = turns.length - 1;
    if (streaming && startIdx >= 0 && turns[startIdx].role === 'System') startIdx--;
    for (let i = startIdx; i >= 0; i--) {
      if (turns[i].role === 'System') return turns[i].content;
    }
    return '';
  });

  // Semantic event streams are emitted once per terminal outcome so the host can transition mode, refetch, notify, etc.
  // `reconciled$` fires on a 409 from the server — our view of the attempt disagrees with reality and the host should re-seed from a fresh GET.
  private readonly _completed$ = new Subject<ConversationAttempt>();
  private readonly _reconciled$ = new Subject<number>();
  private readonly _errored$ = new Subject<{ code: number; attemptId?: number }>();
  readonly completed$: Observable<ConversationAttempt> = this._completed$.asObservable();
  readonly reconciled$: Observable<number> = this._reconciled$.asObservable();
  readonly errored$: Observable<{ code: number; attemptId?: number }> = this._errored$.asObservable();
  
  // `nextSyntheticId` mints negative ids for optimistically-added turns so they can be distinguished
  // from server-assigned (positive) ids — used by rollback to drop only what we optimistically appended.
  // `currentTaskId` is retained so terminal synthesis can reconstruct a full `ConversationAttempt` without an extra round-trip.
  private nextSyntheticId = -1;
  private streamSub: Subscription | null = null;
  private currentTaskId = 0;

  // Clears all session state (called on destroy and before seeding or starting fresh).
  reset(): void {
    this.streamSub?.unsubscribe();
    this.streamSub = null;
    this._isThinking.set(false);
    this._isStreaming.set(false);
    this._transcript.set([]);
    this._currentAttemptId.set(null);
    this.currentTaskId = 0;
    this.nextSyntheticId = -1;
  }

  // Rehydrates from a server-provided attempt (resume flow).
  seed(attempt: ConversationAttempt): void {
    this.reset();
    this._transcript.set([...attempt.turns].sort((a, b) => a.order - b.order));
    this._currentAttemptId.set(attempt.id);
    this.currentTaskId = attempt.conceptElaborationTaskId;
  }

  // Starts or continues a conversation and drives the optimistic flow.
  submit(taskId: number, content: string): void {
    this.currentTaskId = taskId;
    this.appendLearnerTurn(content);
    this._isThinking.set(true);
    this._isStreaming.set(false);

    const attemptId = this._currentAttemptId();
    const source = attemptId === null
      ? this.streamService.startConversation(taskId, content)
      : this.streamService.continueConversation(attemptId, content);

    this.streamSub?.unsubscribe();
    this.streamSub = source.subscribe({
      next: chunk => this.handleChunk(chunk),
      error: () => {
        this.rollbackOptimistic();
        this._errored$.next({ code: 0 });
      },
    });
  }

  // The chunk stream drives the state machine:
  // - the first `text` chunk flips thinking→streaming and opens a new System turn;
  // - subsequent `text` chunks append to it.
  // - A `metadata` chunk closes the turn and either keeps the attempt in progress or emits completion.
  // - An `error` chunk rolls back the optimistic append and either requests reconciliation (409 with attempt id) or surfaces as a generic error.
  private handleChunk(chunk: StreamChunk): void {
    switch (chunk.kind) {
      case 'text':
        if (!this._isStreaming()) {
          this._isThinking.set(false);
          this._isStreaming.set(true);
          this.beginSystemTurn();
        }
        this.appendToLastSystemTurn(chunk.value);
        break;
      case 'metadata':
        this.handleMetadata(chunk);
        break;
      case 'error':
        this.handleErrorChunk(chunk);
        break;
    }
  }

  private handleMetadata(chunk: { kind: 'metadata'; attemptId: number; status: AttemptStatus; summary: string | null; }): void {
    this._isThinking.set(false);
    this._isStreaming.set(false);
    this._currentAttemptId.set(chunk.attemptId);

    if (chunk.status !== 'InProgress') {
      this._completed$.next(this.synthesizeTerminalAttempt(chunk));
    }
  }

  // The server's terminal metadata chunk carries only id/status/summary, but downstream consumers expect a full `ConversationAttempt`.
  private synthesizeTerminalAttempt(chunk: { attemptId: number; status: AttemptStatus; summary: string | null; }): ConversationAttempt {
    return {
      id: chunk.attemptId,
      conceptElaborationTaskId: this.currentTaskId,
      status: chunk.status,
      summary: chunk.summary,
      turns: this._transcript(),
    };
  }

  private handleErrorChunk(chunk: { kind: 'error'; code: number; message: string; attemptId?: number; }): void {
    this.rollbackOptimistic();
    if (chunk.code === 409 && chunk.attemptId) {
      this._reconciled$.next(chunk.attemptId);
    } else {
      this._errored$.next({ code: chunk.code, attemptId: chunk.attemptId });
    }
  }

  // All transcript writes go through these helpers so every optimistic turn gets a synthetic negative id.
  // `rollbackOptimistic` peels off the trailing System (if any) and Learner turns that carry synthetic ids.
  private rollbackOptimistic(): void {
    this._isThinking.set(false);
    this._isStreaming.set(false);
    this._transcript.update(turns => {
      let t = turns;
      if (t.length && t[t.length - 1].role === 'System' && t[t.length - 1].id < 0) {
        t = t.slice(0, -1);
      }
      if (t.length && t[t.length - 1].role === 'Learner' && t[t.length - 1].id < 0) {
        t = t.slice(0, -1);
      }
      return t;
    });
  }

  private appendLearnerTurn(content: string): void {
    this._transcript.update(turns => [
      ...turns,
      {
        id: this.nextSyntheticId--,
        role: 'Learner' as const,
        content,
        order: turns.length,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  private beginSystemTurn(): void {
    this._transcript.update(turns => [
      ...turns,
      {
        id: this.nextSyntheticId--,
        role: 'System' as const,
        content: '',
        order: turns.length,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  private appendToLastSystemTurn(delta: string): void {
    this._transcript.update(turns => {
      if (turns.length === 0) return turns;
      const idx = turns.length - 1;
      const last = turns[idx];
      if (last.role !== 'System') return turns;
      return [...turns.slice(0, idx), { ...last, content: last.content + delta }];
    });
  }
}
