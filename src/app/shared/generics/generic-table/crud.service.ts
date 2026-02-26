import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from '../../model/paged-results.model';
import { Entity } from '../model/entity.model';

export abstract class CrudService<T extends Entity> {
  protected readonly http = inject(HttpClient);

  getAll(baseUrl: string, pageProperties: { page: number; pageSize: number } | null): Observable<PagedResults<T>> {
    let params = new HttpParams();
    if (pageProperties) {
      params = params
        .set('page', pageProperties.page + 1)
        .set('pageSize', pageProperties.pageSize);
    }
    return this.http.get<PagedResults<T>>(baseUrl, { params });
  }

  get(baseUrl: string, id: number): Observable<T> {
    return this.http.get<T>(baseUrl + id);
  }

  create(baseUrl: string, newItem: T): Observable<T> {
    return this.http.post<T>(baseUrl, newItem);
  }

  bulkCreate(baseUrl: string, items: T[]): Observable<unknown> {
    return this.http.post(baseUrl + 'bulk', items);
  }

  clone(baseUrl: string, id: number, newItem: T): Observable<T> {
    return this.http.post<T>(baseUrl + id + '/clone', newItem);
  }

  update(baseUrl: string, updatedItem: T): Observable<T> {
    return this.http.put<T>(baseUrl + updatedItem.id, updatedItem);
  }

  archive(baseUrl: string, id: number, archive: boolean): Observable<T> {
    return this.http.patch<T>(baseUrl + id + '/archive', archive);
  }

  delete(baseUrl: string, id: number): Observable<unknown> {
    return this.http.delete(baseUrl + id);
  }
}
