import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from './note.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: "root"})
export class NotesService {
  constructor(private http: HttpClient) {}

  private getBaseUrl(unitId: number): string {
    return `${environment.apiHost}learning/unit/${unitId}/notes`
  }

  save(note: Note): Observable<Note> {
    return this.http
      .post<Note>(this.getBaseUrl(note.unitId), note)
      .pipe(map((data) => {
        data.mode = 'preview';
        return data;
      }));
  }

  update(note: Note): Observable<void> {
    return this.http.put<void>(`${this.getBaseUrl(note.unitId)}/${note.id}`, note);
  }

  delete(unitId: number, id: number): Observable<any> {
    return this.http.delete(`${this.getBaseUrl(unitId)}/${id}`);
  }

  getAll(unitId: number): Observable<Note[]> {
    return this.http.get<Note[]>(this.getBaseUrl(unitId))
      .pipe(map(this.mapNotes));
  }

  mapNotes(notes: Note[]): Note[] {
    return (notes = notes.map(note => {
      note.mode = 'preview';
      return note;
    }));
  }

  export(unitId: number): Observable<any> {
    return this.http.get(`${this.getBaseUrl(unitId)}/export`, {responseType: 'blob' as 'json'});
  }
}