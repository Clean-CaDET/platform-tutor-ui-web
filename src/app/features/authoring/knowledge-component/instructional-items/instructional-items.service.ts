import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstructionalItem } from '../../../learning/model/learning-object.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InstructionalItemsService {
  private readonly http = inject(HttpClient);

  private baseUrl(kcId: number): string {
    return `${environment.apiHost}authoring/knowledge-components/${kcId}/instruction/`;
  }

  getAll(kcId: number): Observable<InstructionalItem[]> {
    return this.http.get<InstructionalItem[]>(this.baseUrl(kcId));
  }

  create(kcId: number, item: InstructionalItem): Observable<InstructionalItem> {
    return this.http.post<InstructionalItem>(this.baseUrl(kcId), item);
  }

  update(kcId: number, item: InstructionalItem): Observable<InstructionalItem> {
    return this.http.put<InstructionalItem>(this.baseUrl(kcId) + item.id, item);
  }

  updateOrdering(kcId: number, items: InstructionalItem[]): Observable<InstructionalItem[]> {
    return this.http.put<InstructionalItem[]>(this.baseUrl(kcId) + 'ordering', items);
  }

  delete(kcId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl(kcId) + itemId);
  }
}
