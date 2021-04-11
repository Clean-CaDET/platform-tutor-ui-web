import { Injectable } from '@angular/core';
import { Trainee } from '../model/trainee.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

interface LoginDTO {
  index: string;
  password: string;
}

interface RegisterDTO {
  index: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  trainee$ = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  login(loginDTO: LoginDTO): Observable<Trainee> {
    return this.http.post<Trainee>(environment.apiHost + 'trainees', loginDTO)
      .pipe(tap(trainee => this.trainee$.next(trainee)));
  }

  register(registerDTO: RegisterDTO): Observable<Trainee> {
    return this.http.post<Trainee>(environment.apiHost + 'trainees', registerDTO)
      .pipe(tap(trainee => this.trainee$.next(trainee)));
  }

  logout(): void {
    this.trainee$.next(null);
  }
}
