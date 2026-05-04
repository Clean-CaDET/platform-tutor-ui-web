import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StreamingJsonStringsClient, StreamingError } from '../../../core/http/streaming-json-strings-client';
import { StreamChunk } from './model/stream-chunk.model';
import { AttemptStatus } from './model/attempt-status.model';

const SPECIAL_TOKENS: Record<string, string> = {
  'SOFT_CAP': '\nDa bismo izbegli neproduktivno učenje, saberi misli i formiraj odgovor na originalno pitanje kroz narednih par poteza.',
  'CLOSING_TRANSITION': '\nVreme je da zaokružimo ovaj razgovor. Saberi kompletnu razmenu koju smo imali i formuliši sveobuhvatan, precizan i koncizan odgovor na originalno pitanje.',
  'CLOSING_NUDGE': '\nSada je vreme da napišeš kompletan odgovor na originalno pitanje.',
  'EXPIRED': '\nRazgovor je iscrpljen bez finalnog odgovora. Pregledaj materijale i pokušaj ponovo.',
  'OFF_TOPIC': '\nDržimo se teme. Formuliši sledeći korak u objašnjenju.',
};

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
      return { kind: 'text', value: SPECIAL_TOKENS[raw] ?? raw };
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
