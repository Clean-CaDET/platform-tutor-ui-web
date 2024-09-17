export interface Progress {
  id: number;
  order: number;
  name: string;
  status: string;
  completedSteps: number;
  totalSteps: number;
}
