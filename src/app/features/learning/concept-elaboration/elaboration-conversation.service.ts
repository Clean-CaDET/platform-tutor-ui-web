import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ConceptElaborationStreamService } from './concept-elaboration-stream.service';
import { ConversationAttempt } from './model/conversation-attempt.model';
import { ConversationRound } from './model/conversation-round.model';
import { StreamChunk } from './model/stream-chunk.model';
import { AttemptStatus } from './model/attempt-status.model';

/**
 * Owns the lifecycle of a single concept-elaboration conversation: the
 * rounds transcript, the streaming state machine (idle → thinking → streaming →
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

  private readonly _rounds = signal<ConversationRound[]>([]);
  private readonly _isThinking = signal(false);
  private readonly _isStreaming = signal(false);
  private readonly _currentAttemptId = signal<number | null>(null);

  readonly rounds = this._rounds.asReadonly();
  readonly isThinking = this._isThinking.asReadonly();
  readonly isStreaming = this._isStreaming.asReadonly();
  readonly currentAttemptId = this._currentAttemptId.asReadonly();

  // `reconciled$` fires on a 409 from the server — our view of the attempt disagrees with reality and the host should re-seed from a fresh GET.
  private readonly _completed$ = new Subject<ConversationAttempt>();
  private readonly _reconciled$ = new Subject<number>();
  private readonly _errored$ = new Subject<{ code: number; attemptId?: number }>();
  readonly completed$: Observable<ConversationAttempt> = this._completed$.asObservable();
  readonly reconciled$: Observable<number> = this._reconciled$.asObservable();
  readonly errored$: Observable<{ code: number; attemptId?: number }> = this._errored$.asObservable();

  // `preSyntheticLength` records the round count before an optimistic append so rollback can slice back to it.
  // `currentTaskId` is retained so terminal synthesis can reconstruct a full `ConversationAttempt` without an extra round-trip.
  private preSyntheticLength = 0;
  private streamSub: Subscription | null = null;
  private currentTaskId = 0;

  reset(): void {
    this.streamSub?.unsubscribe();
    this.streamSub = null;
    this._isThinking.set(false);
    this._isStreaming.set(false);
    this._rounds.set([]);
    this._currentAttemptId.set(null);
    this.currentTaskId = 0;
    this.preSyntheticLength = 0;
  }

  seed(attempt: ConversationAttempt): void {
    this.reset();
    this._rounds.set([...attempt.rounds].sort((a, b) => a.order - b.order));
    this._currentAttemptId.set(attempt.id);
    this.currentTaskId = attempt.conceptElaborationTaskId;
  }

  submit(taskId: number, content: string): void {
    this.currentTaskId = taskId;
    this.preSyntheticLength = this._rounds().length;
    this.appendLearnerRound(content);
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
  // - the first `text` chunk flips thinking→streaming and opens feedback on the current round;
  // - subsequent `text` chunks append to it.
  // - A `metadata` chunk closes the round and either keeps the attempt in progress or emits completion.
  // - An `error` chunk rolls back the optimistic append and either requests reconciliation (409 with attempt id) or surfaces as a generic error.
  private handleChunk(chunk: StreamChunk): void {
    switch (chunk.kind) {
      case 'text':
        if (!this._isStreaming()) {
          this._isThinking.set(false);
          this._isStreaming.set(true);
          this.beginFeedback();
        }
        this.appendToFeedback(chunk.value);
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

  private synthesizeTerminalAttempt(chunk: { attemptId: number; status: AttemptStatus; summary: string | null; }): ConversationAttempt {
    return {
      id: chunk.attemptId,
      conceptElaborationTaskId: this.currentTaskId,
      status: chunk.status,
      summary: chunk.summary,
      rounds: this._rounds(),
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

  private rollbackOptimistic(): void {
    this._isThinking.set(false);
    this._isStreaming.set(false);
    this._rounds.update(rounds => rounds.slice(0, this.preSyntheticLength));
  }

  private appendLearnerRound(content: string): void {
    this._rounds.update(rounds => [
      ...rounds,
      {
        order: rounds.length,
        elaborationContent: content,
        submittedAt: new Date().toISOString(),
        feedbackContent: null,
      },
    ]);
  }

  private beginFeedback(): void {
    this._rounds.update(rounds => {
      if (rounds.length === 0) return rounds;
      const idx = rounds.length - 1;
      return [...rounds.slice(0, idx), { ...rounds[idx], feedbackContent: '' }];
    });
  }

  private appendToFeedback(delta: string): void {
    this._rounds.update(rounds => {
      if (rounds.length === 0) return rounds;
      const idx = rounds.length - 1;
      const last = rounds[idx];
      if (last.feedbackContent === null) return rounds;
      return [...rounds.slice(0, idx), { ...last, feedbackContent: last.feedbackContent + delta }];
    });
  }
}
