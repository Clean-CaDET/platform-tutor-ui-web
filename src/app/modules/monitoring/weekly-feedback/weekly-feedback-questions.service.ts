import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class WeeklyFeedbackQuestionsService {
  private questionCache: QuestionGroup[] = [];
  
  constructor(private http: HttpClient) { }

  getAll(): Observable<QuestionGroup[]> {
    if (this.questionCache.length) {
      return of(this.questionCache);
    }
  
    return this.http.get<WeeklyFeedbackQuestion[]>(`${environment.apiHost}monitoring/feedback-questions`).pipe(
      map(questions => {
        questions.sort((a, b) => a.id - b.id);
        const questionGroup = new Map<string, WeeklyFeedbackQuestion[]>();
        questions.forEach(q => {
          q.options = JSON.parse(q.options.toString());
          const qValues = q.options.map(o => o.value);
          q.minValue = Math.min(...qValues);
          q.maxValue = Math.max(...qValues);
          const categoryQuestions = questionGroup.get(q.category) ?? [];
          categoryQuestions.push(q);
          questionGroup.set(q.category, categoryQuestions);
        });

        for(let [key, value] of questionGroup.entries()) {
          this.questionCache.push({ name: key, questions: value });
        }

        return this.questionCache;
      })
    );
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
  color: 'primary'|'secondary'|'warn';
  isDefault?: boolean;
}