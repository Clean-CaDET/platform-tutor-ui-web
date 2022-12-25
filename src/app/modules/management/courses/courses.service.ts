import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {StakeholderAccount} from '../model/stakeholder-account';
import {PagedResults} from '../../../shared/model/paged-results';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  baseUrl = environment.apiHost + 'management/courses/';

  constructor(private http: HttpClient) {}

  getOwners(courseId: number): Observable<StakeholderAccount[]> {
    return this.http.get<StakeholderAccount[]>(this.baseUrl + courseId + "/owners/");
  }

  addOwner(courseId: number, instructorId: number): Observable<StakeholderAccount> {
    return this.http.post<StakeholderAccount>(this.baseUrl + courseId + "/owners/", instructorId);
  }

  removeOwner(courseId: number, instructorId: number) {
    return this.http.delete(this.baseUrl + courseId + "/owners/" + instructorId);
  }

  // Should be moved/merged to LearnersService?
  getLearners(indexes: string[]): Observable<PagedResults<StakeholderAccount>> {
    let params = new HttpParams()
    for(let i = 0; i < indexes.length; i++) {
      params = params.set('indexes['+i+']', indexes[i]);
    }
    return this.http.get<PagedResults<StakeholderAccount>>(environment.apiHost + 'management/learners', {params});
  }
}
