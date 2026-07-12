import { Injectable, inject } from '@angular/core';
import { Observable, Subscriber, firstValueFrom } from 'rxjs';
import { TokenStorage } from '../auth/token.storage';
import { AuthService } from '../auth/auth.service';
import { StreamingJsonStringsParser } from './streaming-json-strings-parser';

export interface StreamingError {
  code: number;
  message: string;
}

/**
 * HTTP client for endpoints that stream a sequence of JSON string literals as their
 * response body, exposing each literal as an RxJS `Observable<string>` value.
 * The response body must be a stream of JSON-encoded strings, anything outside `"..."` literals is ignored.
 */
@Injectable({ providedIn: 'root' })
export class StreamingJsonStringsClient {
  private readonly tokens = inject(TokenStorage);
  private readonly auth = inject(AuthService);

  /**
   * Issue a POST whose response is a stream of JSON string literals. Each literal
   * decoded from the stream is delivered via `subscriber.next(value)`. The Observable
   * completes when the server closes the body and errors with a {@link StreamingError}.
   * The request is aborted automatically when the subscription is torn down.
   *
   * @param url  Absolute or app-relative URL of the streaming endpoint.
   * @param body JSON-serialisable request payload.
   */
  post(url: string, body: unknown): Observable<string> {
    // The passed lambda is invoked when someone does .subscribe(...) on the returned Observable
    return new Observable<string>(subscriber => {
      const controller = new AbortController(); // Mechanism for canceling in-flight fetch()
      this.run(url, body, subscriber, controller);
      return () => controller.abort(); // Teardown callback, invoked on unsubscribe / takeUntil
    });
  }

  /**
   * Top-level async workflow for a single subscription:
   *   1. perform the (auth-aware) fetch,
   *   2. pump the body through the parser,
   *   3. complete() or translate any thrown error into a {@link StreamingError}.
   */
  private async run(url: string, body: unknown, subscriber: Subscriber<string>, controller: AbortController): Promise<void> {
    try {
      const res = await this.fetchWithAuth(url, body, controller);
      if (!res.ok || !res.body) {
        subscriber.error({ code: res.status, message: `HTTP ${res.status}` } satisfies StreamingError);
        return;
      }
      await this.pumpBody(res, subscriber);
      subscriber.complete();
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // Consumer unsubscribed — this is not a failure.
        subscriber.complete();
        return;
      }
      if (typeof err === 'object' && err !== null && 'code' in err) {
        // Already shaped as StreamingError (e.g. thrown by `fetchWithAuth` on refresh failure).
        subscriber.error(err as StreamingError);
        return;
      }
      // Anything else (network, TypeError, JSON.parse inside the parser, ...) becomes a transport-level StreamingError with code 0.
      subscriber.error({ code: 0, message: (err as Error).message } satisfies StreamingError);
    }
  }

  /**
   * Perform the fetch, and on a 401 for an authenticated user transparently refresh the access token and retry once.
   */
  private async fetchWithAuth(url: string, body: unknown, controller: AbortController): Promise<Response> {
    const res = await this.doFetch(url, body, controller);
    if (res.status !== 401 || this.auth.user() === null) return res;

    try {
      await firstValueFrom(this.auth.refreshToken());
    } catch {
      this.auth.logout();
      throw { code: 401, message: 'Autentifikacija je istekla.' } satisfies StreamingError;
    }
    return this.doFetch(url, body, controller);
  }

  /**
   * Low-level fetch with bearer-token header attached when one is available.
   */
  private doFetch(url: string, body: unknown, controller: AbortController): Promise<Response> {
    const token = this.tokens.getAccessToken();
    return fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  }

  /**
   * Read the response body as a stream, decode UTF-8 correctly across chunk boundaries,
   * and feed the text into {@link StreamingJsonStringsParser}.
   */
  private async pumpBody(res: Response, subscriber: Subscriber<string>): Promise<void> {
    // Each fully decoded string literal is forwarded to `subscriber.next(...)` via the parser callback.
    const parser = new StreamingJsonStringsParser(raw => subscriber.next(raw));
    const reader = res.body!.getReader();
    const decoder = new TextDecoder('utf-8');
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      // TextDecoder is used with { stream: true } so that multi-byte code points split across chunks are buffered internally and emitted on the next call.
      parser.push(decoder.decode(value, { stream: true }));
    }
    // decoder.decode() with no args flushes any remaining bytes — usually a no-op, but required for correctness at end-of-stream.
    parser.push(decoder.decode());
  }
}
