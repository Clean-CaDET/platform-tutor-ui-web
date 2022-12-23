import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Note} from './note.model';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) {
  }

  saveNote(note: Note): Observable<Note> {
    return this.http.post<Note>(
      environment.apiHost + 'learning/unit/' + note.unitId + '/notes',
      {
        text: note.text,
        unitId: note.unitId,
      })
      .pipe(map(data => {
        data.mode = 'preview';
        return data;
      }));
  }

  updateNote(note: Note): Observable<Note> {
    return this.http.put<Note>(environment.apiHost + 'learning/unit/' + note.unitId + '/notes', note)
    .pipe(map(data => {
      data.mode = 'preview';
      return data;
    }));
  }

  deleteNote(unitId: number, id: number): Observable<any> {
    return this.http.delete(environment.apiHost + 'learning/unit/' + unitId + '/notes/' + id);
  }

  getNotes(unitId: number): Observable<Note[]> {
    return this.http.get<Note[]>(environment.apiHost + 'learning/unit/' + unitId + '/notes').pipe(
      map(notes => this.mapNotes(notes)));
  }

  mapNotes(notes: Note[]): Note[] {
    return notes = notes.map(note => {
      note.mode = 'preview';
      return note;
    });
  }
}
