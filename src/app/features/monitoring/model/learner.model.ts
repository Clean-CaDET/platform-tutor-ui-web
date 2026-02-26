import { CourseReport } from '../../../shared/reports/course-report.model';

export interface Learner {
  id: number;
  index: string;
  name: string;
  surname: string;

  completedTaskCount: number;
  completedStepCount: number;

  semaphore: number;
  semaphoreJustification: string;

  reports?: CourseReport[];
}

export function getAdjacentLearner(learners: Learner[], currentId: number, direction: number): Learner | undefined {
  const currentIndex = learners.findIndex(l => l.id === currentId);
  if (currentIndex === -1) return undefined;
  const newIndex = (currentIndex + direction + learners.length) % learners.length;
  return learners[newIndex];
}
