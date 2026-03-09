import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Note } from './note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly http = inject(HttpClient);

  private getBaseUrl(unitId: number): string {
    return `${environment.apiHost}learning/unit/${unitId}/notes`;
  }

  getAll(unitId: number): Observable<Note[]> {
    return this.http.get<Note[]>(this.getBaseUrl(unitId));
  }

  save(note: Note): Observable<Note> {
    return this.http.post<Note>(this.getBaseUrl(note.unitId), note);
  }

  update(note: Note): Observable<void> {
    return this.http.put<void>(`${this.getBaseUrl(note.unitId)}/${note.id}`, note);
  }

  delete(unitId: number, id: number): Observable<unknown> {
    return this.http.delete(`${this.getBaseUrl(unitId)}/${id}`);
  }

  export(unitId: number): Observable<Blob> {
    return this.http.get(`${this.getBaseUrl(unitId)}/export`, { responseType: 'blob' });
  }
}
