import { Component, OnInit } from '@angular/core';
import { Note } from './model/note.model';

@Component({
  selector: 'cc-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  note: Note;
  notes: Note[];
  edit = false;

  constructor() {
    this.notes = [];
    this.note = new Note();
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.edit = false;
    this.note = new Note();
  }

  onSave(): void {
    // TODO: Make an API call to save the users note
    this.notes.push(this.note);
    this.onCancel();
  }
}
