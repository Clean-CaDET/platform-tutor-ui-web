import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StakeholderAccount } from '../model/stakeholder-account.model';
import { PagedResults } from '../../../shared/model/paged-results.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LearnersService {
  baseUrl = environment.apiHost + 'management/learners/';

  constructor(private http: HttpClient) {}

  getLearners(usernames: string[]): Observable<PagedResults<StakeholderAccount>> {
    // Post because of potential URL length limit violation with query params
    return this.http.post<PagedResults<StakeholderAccount>>(this.baseUrl + 'selected', usernames);
  }
}
