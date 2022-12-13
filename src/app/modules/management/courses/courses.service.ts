import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/shared/generics/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService extends CrudService<Course> {
  constructor(private httpClient: HttpClient) {
    super(httpClient, 'https://localhost:44333/api/management/courses/');
  }
}

interface Course {
  id: number,
  code: string,
  name: string,
  description: string,
  isArchived: boolean
}