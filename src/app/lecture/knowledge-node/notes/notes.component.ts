import { Component, OnInit } from '@angular/core';
import { Note } from './model/note.model';

@Component({
  selector: 'cc-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  text = '';
  notes: Note[];
  edit = false;

  constructor() {
    this.notes = [];
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.edit = false;
    this.text = '# Note';
  }

  onSave(): void {
    // TODO: Make an API call to save the users note
    this.notes.push(new Note({text: this.text}));
    this.onCancel();
  }

  onDelete(noteId: number): void {
    // TODO: Make an API call to delete the note
    this.notes.splice(this.notes.findIndex(note => note.id === noteId), 1);
  }
}
