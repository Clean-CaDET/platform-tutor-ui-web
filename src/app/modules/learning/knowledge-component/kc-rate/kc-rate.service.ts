import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {KnowledgeComponentRate} from "../../model/knowledge-component-rate.model";

@Injectable({
  providedIn: 'root'
})
export class KcRateService {

  constructor(private http: HttpClient) { }

  rate(kcRate: KnowledgeComponentRate): Observable<KnowledgeComponentRate> {
    return this.http.post<KnowledgeComponentRate>(environment.apiHost + 'learning/rate/', kcRate);
  }
}
