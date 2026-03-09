import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StakeholderAccount } from '../model/stakeholder-account.model';
import { PagedResults } from '../../../shared/model/paged-results.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LearnersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'management/learners/';

  getLearners(usernames: string[]): Observable<PagedResults<StakeholderAccount>> {
    return this.http.post<PagedResults<StakeholderAccount>>(this.baseUrl + 'selected', usernames);
  }
}
