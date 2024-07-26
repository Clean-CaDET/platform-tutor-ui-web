import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {UnitProgressRating} from "../../model/unit-progress-rating.model";

@Injectable({providedIn: "root"})
export class KcRateService {

  constructor(private http: HttpClient) { }

  rate(progressRating: UnitProgressRating): Observable<UnitProgressRating> {
    return this.http.post<UnitProgressRating>(environment.apiHost + 'analysis/units/rating', progressRating);
  }
}
