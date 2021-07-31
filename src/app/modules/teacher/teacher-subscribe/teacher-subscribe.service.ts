import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {IndividualPlanModel} from '../models/individual-plan-model';

@Injectable({
  providedIn: 'root'
})
export class TeacherSubscribeService {

  constructor(private http: HttpClient) {
  }

  getIndividualPlans(): Observable<IndividualPlanModel[]> {
    return this.http.get<IndividualPlanModel[]>(environment.apiHost + 'subscriptions/plans');
  }

  subscribe(individualPlanId: number, teacherId: number): void {
    this.http.post<IndividualPlanModel[]>(environment.apiHost + 'subscriptions/', {
      TeacherId: teacherId,
      IndividualPlanId: individualPlanId
    }).subscribe(
      data => console.log(data),
      error => alert(error.error),
    );
  }
}
