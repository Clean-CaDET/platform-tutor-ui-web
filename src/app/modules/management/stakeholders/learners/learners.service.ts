import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/shared/generics/crud.service';

@Injectable({
  providedIn: 'root'
})
export class StakeholdersService extends CrudService<Learner> {
  constructor(private httpClient: HttpClient) {
    super(httpClient, 'https://localhost:44333/api/management/learners');
  }
}

interface Learner {
  id: number,
  index: string,
  name: string,
  surname: string,
  email: string,
  password: string
}