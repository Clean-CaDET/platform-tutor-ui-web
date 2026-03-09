export interface Note {
  text: string;
  unitId: number;
  id?: number;
  courseId?: number;
  order?: number;
}

export interface NoteView {
  note: Note;
  mode: 'preview' | 'edit';
  originalText?: string;
}
