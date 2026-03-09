import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeeklyFeedbackQuestionsService {
  private readonly http = inject(HttpClient);
  private questions$: Observable<QuestionGroup[]> | null = null;

  getAll(): Observable<QuestionGroup[]> {
    if (!this.questions$) {
      this.questions$ = this.http.get<WeeklyFeedbackQuestion[]>(`${environment.apiHost}monitoring/feedback-questions`).pipe(
        map(questions => {
          questions.sort((a, b) => a.id - b.id);
          const groupMap = new Map<string, WeeklyFeedbackQuestion[]>();
          questions.forEach(q => {
            q.options = JSON.parse(q.options as unknown as string);
            const qValues = q.options.map(o => o.value);
            q.minValue = Math.min(...qValues);
            q.maxValue = Math.max(...qValues);
            const categoryQuestions = groupMap.get(q.category) ?? [];
            categoryQuestions.push(q);
            groupMap.set(q.category, categoryQuestions);
          });

          const groups: QuestionGroup[] = [];
          for (const [key, value] of groupMap.entries()) {
            groups.push({ name: key, questions: value });
          }
          return groups;
        }),
        shareReplay(1),
      );
    }
    return this.questions$;
  }
}

export interface QuestionGroup {
  name: string;
  questions: WeeklyFeedbackQuestion[];
}

export interface WeeklyFeedbackQuestion {
  id: number;
  category: string;
  code: string;
  question: string;
  type: string;
  guidance?: string;
  options: QuestionOptions[];
  minValue?: number;
  maxValue?: number;
}

export interface QuestionOptions {
  value: number;
  label: string;
  color?: string;
  isDefault?: boolean;
}
