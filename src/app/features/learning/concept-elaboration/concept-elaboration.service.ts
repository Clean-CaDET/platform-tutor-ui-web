import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ConceptElaborationTaskSummary } from './model/concept-elaboration-task-summary.model';
import { ConceptElaborationTask } from './model/concept-elaboration-task.model';
import { ConversationAttempt } from './model/conversation-attempt.model';

@Injectable({ providedIn: 'root' })
export class ConceptElaborationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'learning/';

  getByUnit(unitId: number): Observable<ConceptElaborationTaskSummary[]> {
    return this.http.get<ConceptElaborationTaskSummary[]>(
      `${this.baseUrl}units/${unitId}/concept-elaborations`
    );
  }

  get(taskId: number): Observable<ConceptElaborationTask> {
    return this.http.get<ConceptElaborationTask>(
      `${this.baseUrl}concept-elaborations/${taskId}`
    );
  }

  abandon(attemptId: number): Observable<ConversationAttempt> {
    return this.http.post<ConversationAttempt>(
      `${this.baseUrl}concept-elaborations/attempts/${attemptId}/abandon`,
      null
    );
  }
}
