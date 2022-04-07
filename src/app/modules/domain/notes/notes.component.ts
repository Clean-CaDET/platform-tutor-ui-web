import {Component, OnInit} from '@angular/core';
import {Note} from './note.model';
import {NotesService} from './notes-service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'cc-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  text = '';
  notes: Note[];
  edit = false;
  unitId: number;

  constructor(private noteService: NotesService, private route: ActivatedRoute) {
    this.notes = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.unitId = +params.unitId;
    });

    this.noteService.getNotes(this.unitId).subscribe(notes =>
      this.notes = notes);
  }

  onCancel(): void {
    this.edit = false;
    this.text = '';
  }

  onSave(): void {
    this.noteService.saveNote(new Note({text: this.text, unitId: this.unitId})).subscribe(
      note => {
        this.notes.push(note);
        this.onCancel();
      }
    );
    console.log(this.notes);
  }

  onUpdate(note: Note): void {
    this.noteService.updateNote(note).subscribe(
      _ => {
        note.mode = 'preview';
      }
    );
  }

  onDelete(noteId: string): void {
    console.log(noteId);
    this.noteService.deleteNote(+noteId).subscribe(
      id => {
        this.notes.splice(this.notes.findIndex(note => note.id === id), 1);
      }
    );
  }
}
