import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssessmentItem } from './model/assessment-item.model';
import { MultipleChoiceQuestion } from './model/mcq.model';
import { MultipleReponseQuestion } from './model/mrq.model';
import { ShortAnswerQuestion } from './model/saq.model';
import { CodeCompletionQuestion } from './model/ccq.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentItemsService {
  private baseUrl(kcId: number): string {
    return environment.apiHost + 'authoring/knowledge-components/' + kcId + '/assessments/';
  }

  constructor(private http: HttpClient) { }

  getAll(kcId: number): Observable<AssessmentItem[]> {
    return this.http.get<AssessmentItem[]>(this.baseUrl(kcId))
      .pipe(map(items => this.mapAssessmentItems(items)));
  }

  create(kcId: number, item: AssessmentItem): Observable<AssessmentItem> {
    return this.http.post<AssessmentItem>(this.baseUrl(kcId), item)
      .pipe(map(item => this.convert(item)));
  }

  update(kcId: number, item: AssessmentItem): Observable<AssessmentItem> {
    return this.http.put<AssessmentItem>(this.baseUrl(kcId)+item.id, item)
      .pipe(map(item => this.convert(item)));
  }

  updateOrdering(kcId: number, items: AssessmentItem[]) {
    return this.http.put<AssessmentItem[]>(this.baseUrl(kcId)+'ordering', items)
      .pipe(map(instruction => this.mapAssessmentItems(instruction)));
  }

  delete(kcId: number, itemId: number): Observable<AssessmentItem> {
    return this.http.delete<AssessmentItem>(this.baseUrl(kcId)+itemId);
  }

  mapAssessmentItems(items: AssessmentItem[]): AssessmentItem[] {
    return items.map(i => this.convert(i));
  }

  convert(item: any): AssessmentItem {
    switch (item.$type) {
      case 'multiChoiceQuestion': return new MultipleChoiceQuestion(item);
      case 'multiResponseQuestion': return new MultipleReponseQuestion(item);
      case 'shortAnswerQuestion': return new ShortAnswerQuestion(item);
      case 'codeCompletionQuestion': return new CodeCompletionQuestion(item);
    }
    return null;
  }
}
