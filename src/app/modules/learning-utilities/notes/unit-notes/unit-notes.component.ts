import { Component, OnInit } from '@angular/core';
import { Note } from '../note.model';
import { NotesService } from '../notes-service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cc-unit-notes',
  templateUrl: './unit-notes.component.html',
  styleUrls: ['./unit-notes.component.css'],
})
export class UnitNotesComponent implements OnInit {
  text = '';
  notes: Note[];
  edit = false;
  unitId: number;
  originalText: string = '';

  constructor(private noteService: NotesService, private route: ActivatedRoute) {
    this.notes = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.unitId = +params.unitId;
      this.noteService
        .getNotes(this.unitId)
        .subscribe(notes => this.notes = notes);
    });
  }

  onCancel(): void {
    this.edit = false;
    this.text = '';
  }

  onSave(): void {
    const note: Note = { text: this.text, unitId: this.unitId };
    this.noteService.saveNote(note).subscribe((note) => {
      this.notes.push(note);
      this.onCancel();
    });
  }

  onUpdate(note: Note): void {
    this.noteService.updateNote(note).subscribe((_) => {
      note.mode = 'preview';
    });
  }

  onDelete(noteId: number): void {
    this.noteService.deleteNote(this.unitId, noteId).subscribe(() => {
      this.notes = this.notes.filter(n => n.id !== noteId);
    });
  }

  onEditNote(note: Note): void {
    this.originalText = note.text;
    note.mode = 'edit';
  }

  onCancelEditNote(note: Note): void {
    note.text = this.originalText;
    note.mode = 'preview';
    this.originalText = '';
  }

  onExport(): void {
    this.noteService
      .exportNotes(this.unitId)
      .subscribe((data) => {
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = "BeleskeIzOblasti" + this.unitId + ".md";
        link.click();
      });
  }
}