import { Injectable } from '@angular/core';
import { Trainee } from './trainee.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

interface LoginDTO {
  index: string;
}

interface RegisterDTO {
  index: string;
  visualScore: number;
  auralScore: number;
  readWriteScore: number;
  kinaestheticScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  trainee$ = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  login(loginDTO: LoginDTO): Observable<Trainee> {
    return this.http.post<Trainee>(environment.apiHost + 'learners/login', loginDTO)
      .pipe(tap(trainee => this.trainee$.next(trainee)));
  }

  register(registerDTO: RegisterDTO): Observable<Trainee> {
    return this.http.post<Trainee>(environment.apiHost + 'learners/register', registerDTO)
      .pipe(tap(trainee => this.trainee$.next(trainee)));
  }

  logout(): void {
    this.trainee$.next(null);
  }
}
