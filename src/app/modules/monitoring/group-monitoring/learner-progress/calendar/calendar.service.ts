import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Session} from "../../../model/session.model";
import {environment} from "../../../../../../environments/environment";
import {Learner} from "../../../model/learner.model";

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private http: HttpClient) {}

  getEvents(learnerId: number): Observable<Session[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('learnerId', learnerId);

    return this.http.get<Session[]>(environment.apiHost + "calendar/sessions", { params: queryParams })
      .pipe(map((data) => {
          const sessions = new Array<Session>();
          data.forEach((session) => {sessions.push(new Session(session) )});
          return sessions;
        })
      );
  }

  getLearnerInfo(learnerId: number): Observable<Learner> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('learnerId', learnerId);

    return this.http.get<Learner>(environment.apiHost + "calendar/learner", {params: queryParams })
  }
}
