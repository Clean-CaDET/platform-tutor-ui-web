import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor(private http: HttpClient) {}

  getGroups() {
    return this.http.get<any[]>(environment.apiHost + 'learners/groups');
  }

  getCourses() {
    return this.http.get<any[]>(environment.apiHost + 'learners/courses');
  }
}
