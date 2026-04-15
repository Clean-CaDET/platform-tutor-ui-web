import { Injectable, inject } from '@angular/core';
import { Observable, Subscriber, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorage } from '../../../core/auth/token.storage';
import { AuthService } from '../../../core/auth/auth.service';
import { StreamChunk } from './model/stream-chunk.model';
import { AttemptStatus } from './model/attempt-status.model';

class StreamingJsonArrayParser {
  private phase: 'pre-array' | 'array-outer' | 'in-string' | 'post-array' = 'pre-array';
  private buffer = '';
  private scanPos = 1;
  private isEscaped = false;

  constructor(private readonly onElement: (value: string) => void) {}

  push(chunk: string): void {
    this.buffer += chunk;
    this.scan();
  }

  private scan(): void {
    while (true) {
      if (this.phase === 'post-array') return;

      if (this.phase === 'pre-array') {
        let i = 0;
        while (i < this.buffer.length && this.isWhitespace(this.buffer[i])) i++;
        if (i >= this.buffer.length) { this.buffer = ''; return; }
        if (this.buffer[i] !== '[') {
          throw new Error(`Expected '[' at start of stream, got '${this.buffer[i]}'`);
        }
        this.buffer = this.buffer.slice(i + 1);
        this.phase = 'array-outer';
        continue;
      }

      if (this.phase === 'array-outer') {
        let i = 0;
        while (i < this.buffer.length && (this.isWhitespace(this.buffer[i]) || this.buffer[i] === ',')) i++;
        if (i >= this.buffer.length) { this.buffer = ''; return; }
        const c = this.buffer[i];
        if (c === ']') {
          this.phase = 'post-array';
          return;
        }
        if (c !== '"') {
          throw new Error(`Expected '"' or ']' in array, got '${c}'`);
        }
        this.buffer = this.buffer.slice(i);
        this.scanPos = 1;
        this.phase = 'in-string';
        continue;
      }

      let completed = false;
      while (this.scanPos < this.buffer.length) {
        const c = this.buffer[this.scanPos];
        if (this.isEscaped) {
          this.isEscaped = false;
          this.scanPos++;
          continue;
        }
        if (c === '\\') {
          this.isEscaped = true;
          this.scanPos++;
          continue;
        }
        if (c === '"') {
          const lit = this.buffer.slice(0, this.scanPos + 1);
          const value = JSON.parse(lit) as string;
          this.onElement(value);
          this.buffer = this.buffer.slice(this.scanPos + 1);
          this.scanPos = 1;
          this.phase = 'array-outer';
          completed = true;
          break;
        }
        this.scanPos++;
      }
      if (!completed) return;
    }
  }

  private isWhitespace(c: string): boolean {
    return c === ' ' || c === '\t' || c === '\n' || c === '\r';
  }
}

@Injectable({ providedIn: 'root' })
export class ConceptElaborationStreamService {
  private readonly tokens = inject(TokenStorage);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = environment.apiHost + 'learning/concept-elaborations/';

  startConversation(taskId: number, content: string): Observable<StreamChunk> {
    return this.stream(`${this.baseUrl}${taskId}/conversations`, { content });
  }

  continueConversation(attemptId: number, content: string): Observable<StreamChunk> {
    return this.stream(`${this.baseUrl}attempts/${attemptId}/turns`, { content });
  }

  private stream(url: string, body: unknown): Observable<StreamChunk> {
    return new Observable<StreamChunk>(subscriber => {
      const controller = new AbortController();
      this.run(url, body, subscriber, controller, true);
      return () => controller.abort();
    });
  }

  private async run(
    url: string,
    body: unknown,
    subscriber: Subscriber<StreamChunk>,
    controller: AbortController,
    canRetry401: boolean,
  ): Promise<void> {
    try {
      const token = this.tokens.getAccessToken();
      const res = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (res.status === 401 && canRetry401 && this.auth.user() !== null) {
        try {
          await firstValueFrom(this.auth.refreshToken());
        } catch {
          this.auth.logout();
          subscriber.next({ kind: 'error', code: 401, message: 'Autentifikacija je istekla.' });
          subscriber.complete();
          return;
        }
        return this.run(url, body, subscriber, controller, false);
      }

      if (!res.ok || !res.body) {
        subscriber.next({ kind: 'error', code: res.status, message: `HTTP ${res.status}` });
        subscriber.complete();
        return;
      }

      const parser = new StreamingJsonArrayParser(raw => this.dispatch(raw, subscriber));
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        parser.push(decoder.decode(value, { stream: true }));
      }
      parser.push(decoder.decode());
      subscriber.complete();
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        subscriber.complete();
        return;
      }
      subscriber.next({ kind: 'error', code: 0, message: (err as Error).message });
      subscriber.complete();
    }
  }

  private dispatch(raw: string, subscriber: Subscriber<StreamChunk>): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      subscriber.next({ kind: 'text', value: raw });
      return;
    }

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const obj = parsed as Record<string, unknown>;
      if ('error' in obj) {
        subscriber.next({
          kind: 'error',
          code: typeof obj['code'] === 'number' ? obj['code'] : 0,
          message: String(obj['error']),
          attemptId: typeof obj['attemptId'] === 'number' ? obj['attemptId'] : undefined,
        });
        return;
      }
      if ('status' in obj && 'attemptId' in obj) {
        subscriber.next({
          kind: 'metadata',
          attemptId: obj['attemptId'] as number,
          status: obj['status'] as AttemptStatus,
          summary: (obj['summary'] as string | null) ?? null,
        });
        return;
      }
    }

    subscriber.next({ kind: 'text', value: raw });
  }
}
