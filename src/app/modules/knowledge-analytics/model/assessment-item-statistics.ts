export interface AssessmentItemStatistics {
  kcId: number;
  aiId: number;
  totalCompleted: number;
  totalPassed: number;
  minutesToCompletion: number[];
  attemptsToPass: number[];
}