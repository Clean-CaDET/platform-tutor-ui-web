import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskProgress } from '../model/task-progress';
import { LearningTask } from '../model/learning-task';
import { StepProgress } from '../model/step-progress';
import { Unit } from '../model/unit.model';

@Injectable({
  providedIn: 'root'
})
export class GradingService {

  constructor(private http: HttpClient) { }

  getUnits(courseid: number, learnerId: number, selectedDate: Date): Observable<Unit[]> {
    const date = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;
    return this.http.get<Unit[]>(environment.apiHost + 'monitoring/units?courseId=' + courseid + '&learnerId=' + learnerId + '&date=' + date);
  }

  getTasks(unitId: number): Observable<LearningTask[]> {
    return this.http.get<LearningTask[]>(environment.apiHost + 'monitoring/units/' + unitId + '/learning-tasks');
  }

  getTaskProgresses(unitId: number, learnerId: number): Observable<TaskProgress[]> {
    return this.http.get<TaskProgress[]>(environment.apiHost + 'monitoring/units/' + unitId + '/learning-tasks/learners/' + learnerId + '/progresses');
  }

  submitGrade(unitId: number, progressId: number, stepProgress: StepProgress): Observable<TaskProgress> {
    return this.http.put<TaskProgress>(environment.apiHost + 'monitoring/units/' + unitId + '/learning-tasks/progresses/' + progressId +'/steps', stepProgress);
  }
}
