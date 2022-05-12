import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Note} from './note.model';
import {environment} from '../../../../environments/environment';
import {AuthenticationService} from '../../../infrastructure/auth/auth.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  saveNote(note: Note): Observable<Note> {
    return this.http.post(
      environment.apiHost + 'notes',
      {
        text: note.text,
        unitId: note.unitId,
        learnerId: this.authService.user$.value.learnerId
      }).pipe(map(data => {
      return new Note(data);
    }));
  }

  updateNote(note: Note): Observable<Note> {
    return this.http.put(environment.apiHost + 'notes', note).pipe(map(data => {
      return new Note(data);
    }));
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(environment.apiHost + 'notes/' + id);
  }

  getNotes(unitId: number): Observable<Note[]> {
    return this.http.get<Note[]>(environment.apiHost + 'notes/' + unitId).pipe(
      map(notes => this.mapNotes(notes)));
  }

  mapNotes(notes: Note[]): Note[] {
    return notes = notes.map(note => {
      return new Note(note);
    });
  }
}
