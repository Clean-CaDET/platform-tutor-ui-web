import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {PagedResults} from '../../model/paged-results.model';
import { Entity } from '../model/entity.model';

@Injectable({
  providedIn: 'root'
})
export abstract class CrudService<T extends Entity> {
  constructor(private http: HttpClient) {}

  getAll(baseUrl: string, pageProperties: any) : Observable<PagedResults<T>> {
    let params = new HttpParams();
    if(pageProperties) {
      params = params
      .set('page', pageProperties.page+1)
      .set('pageSize', pageProperties.pageSize)
    }
    return this.http.get<PagedResults<T>>(baseUrl, { params: params});
  }

  get(baseUrl: string, id: number): Observable<T> {
    return this.http.get<T>(baseUrl + id);
  }

  create(baseUrl: string, newItem: T): Observable<T> {
    return this.http.post<T>(baseUrl, newItem);
  }

  bulkCreate(baseUrl: string, items: T[]): Observable<T> {
    return this.http.post<T>(baseUrl + "bulk", items);
  }

  clone(baseUrl: string, id: number, newItem: T): Observable<T> {
    return this.http.post<T>(baseUrl + id + "/clone", newItem);
  }

  update(baseUrl: string, updatedItem: T): Observable<any> {
      return this.http.put(baseUrl + updatedItem.id, updatedItem);
  }

  archive(baseUrl: string, id: number, archive: boolean) {
    return this.http.patch(baseUrl + id + "/archive", archive);
  }

  delete(baseUrl: string, id: number): Observable<any> {
      return this.http.delete(baseUrl + id);
  }
}
