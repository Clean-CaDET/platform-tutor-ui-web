import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {UnitProgressRating} from "../../model/unit-progress-rating.model";
import { UnitFeedbackRequest } from '../../model/unit-feedback-request.model';

@Injectable({providedIn: "root"})
export class UnitProgressRatingService {

  constructor(private http: HttpClient) { }

  shouldRequestFeedback(unitId: number): Observable<UnitFeedbackRequest> {
    return this.http.get<UnitFeedbackRequest>(environment.apiHost + 'analysis/rating/units/' + unitId);
  }

  rate(progressRating: UnitProgressRating): Observable<UnitProgressRating> {
    return this.http.post<UnitProgressRating>(environment.apiHost + 'analysis/rating/units', progressRating);
  }
}
