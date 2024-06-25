export interface Enrollment {
  id?: number;
  knowledgeUnitId?: number;
  learnerId?: number;
  availableFrom?: Date;
  bestBefore?: Date;
  status: string;
}