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

  // TODO: potential Bug -> set Note.mode to 'preview' default -> might be fixed

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
    const note: Note = {text: this.text, unitId: this.unitId}  
    this.noteService.saveNote(note).subscribe(
      note => {
        this.notes.push(note);
        this.onCancel();
      }
    );
  }

  onUpdate(note: Note): void {
    this.noteService.updateNote(note).subscribe(
      _ => {
        note.mode = 'preview';
      }
    );
  }

  onDelete(noteId: string): void {
    this.noteService.deleteNote(this.unitId, +noteId).subscribe(
      id => {
        this.notes.splice(this.notes.findIndex(note => note.id === id), 1);
      }
    );
  }
}
