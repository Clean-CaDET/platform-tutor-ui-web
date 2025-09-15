import { WeeklyFeedback } from "../weekly-feedback/weekly-feedback.model";

export interface Learner {
  id: number;
  index: string;
  name: string;
  surname: string;
  
  // Grading summaries
  completedTaskCount: number;
  completedStepCount: number;

  // Feedback summaries
  semaphore: number;
  semaphoreJustification: string;

  // Course overview
  recentFeedback?: WeeklyFeedback[];
  weeklyFeedback?: WeeklyFeedback[];
  summarySemaphore: number;
}
