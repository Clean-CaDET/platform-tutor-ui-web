export interface Note {
  text: string;
  unitId: number;
  id?: number;
  courseId?: number;
  order?: number;
  
  mode?: string;
  originalText?: string;
}
