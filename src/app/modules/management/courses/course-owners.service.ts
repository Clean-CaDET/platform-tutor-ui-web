import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {StakeholderAccount} from '../model/stakeholder-account';

@Injectable({
  providedIn: 'root'
})
export class CourseOwnersService {
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
}
