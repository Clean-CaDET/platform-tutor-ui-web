import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {
  baseUrl = 'https://localhost:44333/api/management/instructors/';
  
  constructor(private http: HttpClient) {}
    
  getOwnedCourses(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + id + "/ownerships/");
  }

  addOwnedCourse(instructorId: number, courseId: number) {
    return this.http.post(this.baseUrl + instructorId + "/ownerships/", courseId);
  }

  removeOwnedCourse(instructorId: number, courseId: number) {
    return this.http.delete(this.baseUrl + instructorId + "/ownerships/" + courseId);
  }
}