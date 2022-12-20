import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseOwnersService {
  baseUrl = 'https://localhost:44333/api/management/courses/';

  constructor(private http: HttpClient) {}

  getOwners(courseId: number) {
    return this.http.get<any[]>(this.baseUrl + courseId + "/owners/");
  }

  addOwner(courseId: number, instructorId: number) {
    return this.http.post(this.baseUrl + courseId + "/owners/", instructorId);
  }

  removeOwner(courseId: number, instructorId: number) {
    return this.http.delete(this.baseUrl + courseId + "/owners/" + instructorId);
  }
}