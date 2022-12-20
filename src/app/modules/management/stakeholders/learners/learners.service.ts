import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LearnersService {
  baseUrl: 'https://localhost:44333/api/management/learners/';

  constructor(private http: HttpClient) {}
}