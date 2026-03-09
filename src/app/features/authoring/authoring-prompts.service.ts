import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SystemPrompt {
  category: string;
  code: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class AuthoringPromptsService {
  private readonly http = inject(HttpClient);
  private readonly promptCache = new Map<string, SystemPrompt[]>();

  getAll(category: string): Observable<SystemPrompt[]> {
    if (this.promptCache.has(category)) {
      return of(this.promptCache.get(category)!);
    }

    return this.http.get<SystemPrompt[]>(`${environment.apiHost}authoring/prompts`).pipe(
      tap(prompts => this.promptCache.set(category, prompts))
    );
  }
}
