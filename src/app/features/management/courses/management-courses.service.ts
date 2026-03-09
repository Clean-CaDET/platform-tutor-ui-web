import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StakeholderAccount } from '../model/stakeholder-account.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ManagementCoursesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'management/courses/';

  getOwners(courseId: number): Observable<StakeholderAccount[]> {
    return this.http.get<StakeholderAccount[]>(this.baseUrl + courseId + '/owners/');
  }

  addOwner(courseId: number, instructorId: number): Observable<StakeholderAccount> {
    return this.http.post<StakeholderAccount>(this.baseUrl + courseId + '/owners/', instructorId);
  }

  removeOwner(courseId: number, instructorId: number): Observable<unknown> {
    return this.http.delete(this.baseUrl + courseId + '/owners/' + instructorId);
  }
}
