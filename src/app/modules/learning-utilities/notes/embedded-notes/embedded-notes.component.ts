import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Note } from '../note.model';
import { NotesService } from '../notes-service';

@Component({
  selector: 'cc-embedded-notes',
  templateUrl: './embedded-notes.component.html',
  styleUrls: ['./embedded-notes.component.css'],
})
export class EmbeddedNotesComponent implements OnInit, OnChanges {
  @Input() courseId: number;
  @Input() unitId: number;
  
  notes: Note[] = [];
  originalText: string = '';
  addingNote = false;
  newNoteText = '';

  constructor(private noteService: NotesService) {
  }

  ngOnInit(): void {
    if (this.unitId) {
      this.loadNotes();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['unitId'] && this.unitId) {
      this.loadNotes();
    }
  }

  private loadNotes(): void {
    this.noteService.getAll(this.unitId).subscribe(notes => {
      this.notes = notes;
      this.sortNotes();
    });
  }

  private sortNotes(): void {
    this.notes.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  onCancelAddNote(): void {
    this.addingNote = false;
    this.newNoteText = '';
  }

  onSaveNote(): void {
    if (!this.newNoteText.trim()) return;
    
    const maxOrder = this.notes.length > 0 ? 
      Math.max(...this.notes.map(n => n.order || 0)) : 0;
    
    const note: Note = { 
      text: this.newNoteText, 
      unitId: this.unitId,
      courseId: this.courseId,
      order: maxOrder + 1
    };
    
    this.noteService.save(note).subscribe((savedNote) => {
      this.notes.push(savedNote);
      this.sortNotes();
      this.onCancelAddNote();
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

  trackByNoteId(index: number, item: Note): number {
    return item.id!;
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