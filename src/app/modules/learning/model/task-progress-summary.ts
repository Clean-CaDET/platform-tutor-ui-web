export interface TaskProgressSummary {
  id: number;
  order: number;
  name: string;
  status: string;
  completedSteps: number;
  totalSteps: number;
  totalScore: number;
  maxPoints: number;
}
