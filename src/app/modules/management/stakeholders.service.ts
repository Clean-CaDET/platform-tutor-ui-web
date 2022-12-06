import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StakeholdersService {
  constructor(private http: HttpClient) { }

  GetAll(learners: boolean) {
    let url = GetPath(learners);
    return this.http.get(url);
  }

  
}

function GetPath(learners: boolean) {
  let path = 'https://localhost:44333/api/management/';
  return learners ? path + 'learners' : path + 'instructors';
}

