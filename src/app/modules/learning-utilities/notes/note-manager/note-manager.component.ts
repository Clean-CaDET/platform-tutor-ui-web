import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Note } from '../note.model';
import { NotesService } from '../notes-service';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';

@Component({
  selector: 'cc-note-manager',
  templateUrl: './note-manager.component.html',
  styleUrls: ['./note-manager.component.css']
})
export class NoteManagerComponent implements OnInit, OnChanges {
  @Input() unitId: number;
  @Input() courseId: number;
  @Input() embedded: boolean = false;
  @Input() emptyStateText: string = 'Nema beleški za ovu lekciju.';
  
  notes: Note[] = [];
  addingNote = false;
  newNoteText = '';
  originalText: string = '';

  constructor(private noteService: NotesService, private dialog: MatDialog) {}

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
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(!result) return;

      this.noteService.delete(this.unitId, noteId).subscribe(() => {
        this.notes = this.notes.filter(n => n.id !== noteId);
      });
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

  sortNotes(): void {
    this.notes.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  moveNoteUp(noteIndex: number): void {
    if (noteIndex === 0) return;

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

  trackByNoteId(index: number, item: Note): number {
    return item.id!;
  }
}