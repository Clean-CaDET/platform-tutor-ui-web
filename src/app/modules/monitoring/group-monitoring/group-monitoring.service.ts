import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Group} from '../model/group.model';
import {PagedResults} from '../../../shared/model/paged-results.model';
import { Learner } from '../model/learner.model';

@Injectable({providedIn: "root"})
export class GroupMonitoringService {
  constructor(private http: HttpClient) {}

  getGroups(courseId: number): Observable<PagedResults<Group>> {
    return this.http.get<PagedResults<Group>>(environment.apiHost + `monitoring/${courseId}/groups`);
  }

  getLearners(groupId: number, courseId: number): Observable<PagedResults<Learner>> {
    return this.http.get<PagedResults<Learner>>(environment.apiHost + `monitoring/${courseId}/groups/${groupId}`);
  }
}
