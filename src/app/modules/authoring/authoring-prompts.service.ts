import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthoringPromptsService {
  private promptCache: Map<string, SystemPrompt[]> = new Map();
  
  constructor(private http: HttpClient) { }

  getAll(category: string): Observable<SystemPrompt[]> {
    if (this.promptCache.has(category)) {
      return of(this.promptCache.get(category)!);
    }
  
    return this.http.get<SystemPrompt[]>(`${environment.apiHost}authoring/prompts`).pipe(
      tap(prompts => this.promptCache.set(category, prompts))
    );
  }
}

export interface SystemPrompt {
  category: string;
  code: string;
  content: string;
}