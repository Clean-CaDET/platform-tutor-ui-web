import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {StakeholderAccount} from '../model/stakeholder-account.model';
import {environment} from '../../../../environments/environment';

@Injectable({providedIn: "root"})
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
}
