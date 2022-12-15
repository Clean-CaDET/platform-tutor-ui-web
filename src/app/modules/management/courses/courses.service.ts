import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  baseUrl: 'https://localhost:44333/api/management/courses/';

  constructor(private http: HttpClient) {}
}