import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {StakeholderAccount} from '../model/stakeholder-account.model';
import {PagedResults} from '../../../shared/model/paged-results.model';
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

  getLearners(indexes: string[]): Observable<PagedResults<StakeholderAccount>> {
    // Should be moved/merged to LearnersService?
    // Post because of potential URL length limit violation with query params
    return this.http.post<PagedResults<StakeholderAccount>>(environment.apiHost + 'management/learners/selected', indexes);
  }
}
