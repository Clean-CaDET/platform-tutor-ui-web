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
  courseId: number;
  originalText: string = '';

  constructor(private noteService: NotesService, private route: ActivatedRoute) {
    this.notes = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.unitId = +params.unitId;
      this.courseId = +params.courseId;
      this.noteService
        .getAll(this.unitId)
        .subscribe(notes => {
          this.notes = notes;
          this.sortNotes();
        });
    });
  }

  onCancel(): void {
    this.edit = false;
    this.text = '';
  }

  onSave(): void {
    const maxOrder = this.notes.length > 0 ? Math.max(...this.notes.map(n => n.order || 0)) : 0;
    const note: Note = { 
      text: this.text, 
      unitId: this.unitId,
      courseId: this.courseId,
      order: maxOrder + 1
    };
    this.noteService.save(note).subscribe((note) => {
      this.notes.push(note);
      this.sortNotes();
      this.onCancel();
    });
  }

  onUpdate(note: Note): void {
    this.noteService.update(note).subscribe((_) => {
      note.mode = 'preview';
    });
  }

  onDelete(noteId: number): void {
    this.noteService.delete(this.unitId, noteId).subscribe(() => {
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
      .export(this.unitId)
      .subscribe((data) => {
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = "BeleskeIzOblasti" + this.unitId + ".md";
        link.click();
      });
  }

  sortNotes(): void {
    this.notes.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  moveNoteUp(noteIndex: number): void {
    if (noteIndex == 0) return;

    const currentNote = this.notes[noteIndex];
    const previousNote = this.notes[noteIndex - 1];
    
    const tempOrder = currentNote.order;
    currentNote.order = previousNote.order;
    previousNote.order = tempOrder;
    
    this.noteService.update(currentNote).subscribe();
    this.noteService.update(previousNote).subscribe();
    
    this.sortNotes();
  }

  moveNoteDown(noteIndex: number): void {
    if (noteIndex >= this.notes.length - 1) return;

    const currentNote = this.notes[noteIndex];
    const nextNote = this.notes[noteIndex + 1];
    
    const tempOrder = currentNote.order;
    currentNote.order = nextNote.order;
    nextNote.order = tempOrder;
    
    this.noteService.update(currentNote).subscribe();
    this.noteService.update(nextNote).subscribe();
    
    this.sortNotes();
  }
}