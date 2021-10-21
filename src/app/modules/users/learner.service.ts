import { Injectable } from '@angular/core';
import { Learner } from './model/learner.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

interface LoginDTO {
  index: string;
}

interface RegisterDTO {
  index: string;
}

@Injectable({
  providedIn: 'root'
})
export class LearnerService {

  learner$ = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  login(loginDTO: LoginDTO): Observable<Learner> {
    return this.http.post<Learner>(environment.apiHost + 'learners/login', loginDTO)
      .pipe(tap(learner => this.learner$.next(learner)));
  }

  register(registerDTO: RegisterDTO): Observable<Learner> {
    return this.http.post<Learner>(environment.apiHost + 'learners/register', registerDTO)
      .pipe(tap(learner => this.learner$.next(learner)));
  }

  logout(): void {
    this.learner$.next(null);
  }
}
