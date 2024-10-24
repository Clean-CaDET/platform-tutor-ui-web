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
}
