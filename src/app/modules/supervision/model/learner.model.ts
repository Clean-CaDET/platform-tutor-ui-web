import { WeeklyFeedback } from "../../monitoring/weekly-feedback/weekly-feedback.model";

export interface Learner {
  id: number;
  index: string;
  name: string;
  surname: string;

  recentFeedback?: WeeklyFeedback[];
  weeklyFeedback?: WeeklyFeedback[];
  summarySemaphore: number;
}
