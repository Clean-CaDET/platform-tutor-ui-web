import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/generics/generic-table/crud.service';
import {Observable} from 'rxjs';
import {StakeholderAccount} from '../model/stakeholder-account';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  baseUrl = 'https://localhost:44333/api/management/courses/';

  constructor(private http: HttpClient) {}

  getOwners(courseId: number): Observable<StakeholderAccount[]> {
    return this.http.get<StakeholderAccount[]>(this.baseUrl + courseId + "/owners/");
  }

  addOwner(courseId: number, instructorId: number) {
    return this.http.post(this.baseUrl + courseId + "/owners/", instructorId);
  }

  removeOwner(courseId: number, instructorId: number) {
    return this.http.delete(this.baseUrl + courseId + "/owners/" + instructorId);
  }

  // Should be moved/merged to LearnersService?
  getLearners(indexes: string[]) {
    let params = new HttpParams()
    for(let i = 0; i < indexes.length; i++) {
      params = params.set('indexes['+i+']', indexes[i]);
    }
    return this.http.get<PagedResults<any>>('https://localhost:44333/api/management/learners', {params: params});
  }
}
