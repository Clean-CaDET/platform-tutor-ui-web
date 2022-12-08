import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class CrudService<T> {
  url: string

  constructor(private http: HttpClient, url:string) {
    this.url = url;
  }

  getAll(params?: HttpParams) : Observable<T[]> {
    return this.http.get<T[]>(this.url, { params: params});
  }

  get(id: number): Observable<T> {
    return this.http.get<T>(this.url + id);
  }

  create(newItem: T): Observable<T> {
    return this.http.post<T>(this.url, newItem);
  }

  update(updatedItem: T): Observable<any> {
      return this.http.put(this.url, updatedItem);
  }

  delete(id: string): Observable<any> {
      return this.http.delete(this.url + id);
  }
}
