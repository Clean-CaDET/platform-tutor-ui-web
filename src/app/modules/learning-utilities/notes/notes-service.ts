import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from './note.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: "root"})
export class NotesService {
  constructor(private http: HttpClient) {}

  save(note: Note): Observable<Note> {
    return this.http
      .post<Note>(`${environment.apiHost}learning/unit/${note.unitId}/notes`, note)
      .pipe(map((data) => {
        data.mode = 'preview';
        return data;
      }));
  }

  update(note: Note): Observable<void> {
    return this.http.put<void>(`${environment.apiHost}learning/unit/${note.unitId}/notes/${note.id}`, note);
  }

  delete(unitId: number, id: number): Observable<any> {
    return this.http.delete(`${environment.apiHost}learning/unit/${unitId}/notes/${id}`);
  }

  getAll(unitId: number): Observable<Note[]> {
    return this.http
      .get<Note[]>(environment.apiHost + 'learning/unit/' + unitId + '/notes')
      .pipe(map(this.mapNotes));
  }

  mapNotes(notes: Note[]): Note[] {
    return (notes = notes.map(note => {
      note.mode = 'preview';
      return note;
    }));
  }

  export(unitId: number): Observable<any> {
    return this.http.get(`${environment.apiHost}learning/unit/${unitId}/notes/export`, {responseType: 'blob' as 'json'});
  }
}
