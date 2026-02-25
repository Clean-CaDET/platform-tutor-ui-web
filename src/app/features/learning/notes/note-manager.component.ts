import { Component, ChangeDetectionStrategy, inject, input, signal, effect } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';
import { MarkdownEditorComponent } from '../../../shared/markdown/markdown-editor/markdown-editor.component';
import { DeleteFormComponent } from '../../../shared/generics/delete-form/delete-form.component';
import { saveAs } from '../../../core/save-as.util';
import { NotesService } from './notes.service';
import { Note, NoteView } from './note.model';

@Component({
  selector: 'cc-note-manager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule,
    CcMarkdownComponent, MarkdownEditorComponent,
  ],
  templateUrl: './note-manager.component.html',
  styleUrl: './note-manager.component.scss',
})
export class NoteManagerComponent {
  private readonly noteService = inject(NotesService);
  private readonly dialog = inject(MatDialog);

  readonly unitId = input.required<number>();
  readonly courseId = input.required<number>();
  readonly embedded = input(false);
  readonly emptyStateText = input('Nema beleški za ovu lekciju.');

  readonly noteViews = signal<NoteView[]>([]);
  readonly addingNote = signal(false);
  readonly newNoteText = signal('');

  constructor() {
    effect(() => {
      const uid = this.unitId();
      if (uid) this.loadNotes(uid);
    });
  }

  onCancelAddNote(): void {
    this.addingNote.set(false);
    this.newNoteText.set('');
  }

  onSaveNote(): void {
    if (!this.newNoteText().trim()) return;

    const currentViews = this.noteViews();
    const maxOrder = currentViews.length > 0
      ? Math.max(...currentViews.map(nv => nv.note.order || 0))
      : 0;

    const note: Note = {
      text: this.newNoteText(),
      unitId: this.unitId(),
      courseId: this.courseId(),
      order: maxOrder + 1,
    };

    this.noteService.save(note).subscribe(savedNote => {
      this.noteViews.update(views =>
        [...views, { note: savedNote, mode: 'preview' as const }]
          .sort((a, b) => (a.note.order || 0) - (b.note.order || 0)),
      );
      this.onCancelAddNote();
    });
  }

  onUpdate(nv: NoteView): void {
    this.noteService.update(nv.note).subscribe(() => {
      this.noteViews.update(views =>
        views.map(v => v.note.id === nv.note.id ? { ...v, mode: 'preview' as const } : v),
      );
    });
  }

  onDelete(noteId: number): void {
    const diagRef = this.dialog.open(DeleteFormComponent);
    diagRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.noteService.delete(this.unitId(), noteId).subscribe(() => {
        this.noteViews.update(views => views.filter(v => v.note.id !== noteId));
      });
    });
  }

  onEditNote(nv: NoteView): void {
    this.noteViews.update(views =>
      views.map(v => v.note.id === nv.note.id
        ? { ...v, mode: 'edit' as const, originalText: v.note.text }
        : v),
    );
  }

  onCancelEditNote(nv: NoteView): void {
    this.noteViews.update(views =>
      views.map(v => v.note.id === nv.note.id
        ? { note: { ...v.note, text: v.originalText! }, mode: 'preview' as const }
        : v),
    );
  }

  onNoteTextChange(nv: NoteView, text: string): void {
    this.noteViews.update(views =>
      views.map(v => v.note.id === nv.note.id
        ? { ...v, note: { ...v.note, text } }
        : v),
    );
  }

  moveNoteUp(noteIndex: number): void {
    if (noteIndex === 0) return;
    const views = this.noteViews();
    const current = { ...views[noteIndex].note, order: views[noteIndex - 1].note.order };
    const previous = { ...views[noteIndex - 1].note, order: views[noteIndex].note.order };

    forkJoin([
      this.noteService.update(current),
      this.noteService.update(previous),
    ]).subscribe(() => {
      this.noteViews.update(vs =>
        vs.map(v => {
          if (v.note.id === current.id) return { ...v, note: current };
          if (v.note.id === previous.id) return { ...v, note: previous };
          return v;
        }).sort((a, b) => (a.note.order || 0) - (b.note.order || 0)),
      );
    });
  }

  moveNoteDown(noteIndex: number): void {
    const views = this.noteViews();
    if (noteIndex >= views.length - 1) return;
    const current = { ...views[noteIndex].note, order: views[noteIndex + 1].note.order };
    const next = { ...views[noteIndex + 1].note, order: views[noteIndex].note.order };

    forkJoin([
      this.noteService.update(current),
      this.noteService.update(next),
    ]).subscribe(() => {
      this.noteViews.update(vs =>
        vs.map(v => {
          if (v.note.id === current.id) return { ...v, note: current };
          if (v.note.id === next.id) return { ...v, note: next };
          return v;
        }).sort((a, b) => (a.note.order || 0) - (b.note.order || 0)),
      );
    });
  }

  onExport(): void {
    this.noteService.export(this.unitId()).subscribe(data => {
      saveAs(data, `BeleskeIzOblasti${this.unitId()}.md`);
    });
  }

  private loadNotes(unitId: number): void {
    this.noteService.getAll(unitId).subscribe(notes => {
      const sorted = notes.sort((a, b) => (a.order || 0) - (b.order || 0));
      this.noteViews.set(sorted.map(note => ({ note, mode: 'preview' as const })));
    });
  }
}
