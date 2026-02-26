export interface GradingTaskProgress {
  id: number;
  learningTaskId: number;
  learnerId: number;
  status: string;
  stepProgresses?: GradingStepProgress[];
}

export interface GradingStepProgress {
  id: number;
  taskProgressId: number;
  answer: string;
  commentForMentor?: string;
  status: string;
  stepId: number;
  evaluations?: StandardEvaluation[];
  comment?: string;
}

export interface StandardEvaluation {
  standardId: number;
  points: number;
  comment?: string;
}
