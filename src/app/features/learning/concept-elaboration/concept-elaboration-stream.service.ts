import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StreamingJsonStringsClient, StreamingError } from '../../../core/http/streaming-json-strings-client';
import { StreamChunk } from './model/stream-chunk.model';
import { AttemptStatus } from './model/attempt-status.model';

@Injectable({ providedIn: 'root' })
export class ConceptElaborationStreamService {
  private readonly client = inject(StreamingJsonStringsClient);
  private readonly baseUrl = environment.apiHost + 'learning/concept-elaborations/';

  startConversation(taskId: number, content: string): Observable<StreamChunk> {
    return this.pipeline(this.client.post(`${this.baseUrl}${taskId}/conversations`, { content }));
  }

  continueConversation(attemptId: number, content: string): Observable<StreamChunk> {
    return this.pipeline(this.client.post(`${this.baseUrl}attempts/${attemptId}/turns`, { content }));
  }

  private pipeline(source: Observable<string>): Observable<StreamChunk> {
    return source.pipe(
      map(raw => this.toChunk(raw)),
      catchError((err: StreamingError) =>
        of<StreamChunk>({ kind: 'error', code: err.code, message: err.message }),
      ),
    );
  }

  private toChunk(raw: string): StreamChunk {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { kind: 'text', value: raw };
    }

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const obj = parsed as Record<string, unknown>;
      if ('error' in obj) {
        return {
          kind: 'error',
          code: typeof obj['code'] === 'number' ? obj['code'] : 0,
          message: String(obj['error']),
          attemptId: typeof obj['attemptId'] === 'number' ? obj['attemptId'] : undefined,
        };
      }
      if ('status' in obj && 'attemptId' in obj) {
        return {
          kind: 'metadata',
          attemptId: obj['attemptId'] as number,
          status: obj['status'] as AttemptStatus,
          summary: (obj['summary'] as string | null) ?? null,
        };
      }
    }

    return { kind: 'text', value: raw };
  }
}
