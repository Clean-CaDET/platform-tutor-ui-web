export interface StandardEvaluation {
  standardId?: number;
  points: number;
  comment: string;
}

export interface StepProgress {
  id?: number;
  answer: string;
  commentForMentor?: string;
  status: string;
  stepId: number;
  evaluations?: StandardEvaluation[];
  comment?: string;
}
