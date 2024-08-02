export interface UnitProgressRating {
  knowledgeUnitId: number;
  completedKcIds: number[];
  completedTaskIds: number[];
  created?: Date;
  feedback: string;
  isLearnerInitiated: boolean;
}
