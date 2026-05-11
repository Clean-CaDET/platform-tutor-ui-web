import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StreamingJsonStringsClient, StreamingError } from '../../../core/http/streaming-json-strings-client';
import { StreamChunk } from './model/stream-chunk.model';
import { AttemptStatus } from './model/attempt-status.model';

const SPECIAL_TOKENS: Record<string, string> = {
  'STAGNATION_REDIRECT': '\n\nSlabo napredujemo. Razmisli da li je svrsishodnije da se posvetiš materijalima i produbljivanju razumevanja ispitivanog koncepta.',
};

@Injectable({ providedIn: 'root' })
export class ConceptElaborationStreamService {
  private readonly client = inject(StreamingJsonStringsClient);
  private readonly baseUrl = environment.apiHost + 'learning/concept-elaborations/';

  startConversation(taskId: number, elaboration: string): Observable<StreamChunk> {
    return this.pipeline(this.client.post(`${this.baseUrl}${taskId}/conversations`, { elaboration }));
  }

  continueConversation(attemptId: number, elaboration: string): Observable<StreamChunk> {
    return this.pipeline(this.client.post(`${this.baseUrl}attempts/${attemptId}/elaborations`, { elaboration }));
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
      return { kind: 'text', value: SPECIAL_TOKENS[raw] ?? raw };
    }

    if (typeof parsed === 'string') {
      return { kind: 'text', value: SPECIAL_TOKENS[parsed] ?? parsed };
    }

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const obj = this.normalizeKeys(parsed as Record<string, unknown>);
      if ('error' in obj) {
        return {
          kind: 'error',
          code: typeof obj['code'] === 'number' ? obj['code'] : 0,
          message: String(obj['error']),
          attemptId: typeof obj['attemptid'] === 'number' ? obj['attemptid'] : undefined,
        };
      }
      if ('status' in obj && 'attemptid' in obj) {
        return {
          kind: 'metadata',
          attemptId: obj['attemptid'] as number,
          status: obj['status'] as AttemptStatus,
          summary: (obj['summary'] as string | null) ?? null,
        };
      }
    }

    return { kind: 'text', value: SPECIAL_TOKENS[raw] ?? raw };
  }

  private normalizeKeys(obj: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj)) out[k.toLowerCase()] = obj[k];
    return out;
  }
}
