import { WeeklyFeedback } from '../../monitoring/weekly-feedback/weekly-feedback.model';
import { CourseReport } from '../../../shared/reports/course-report.model';

export interface SupervisionLearner {
  id: number;
  index: string;
  name: string;
  surname: string;
  recentFeedback?: WeeklyFeedback[];
  weeklyFeedback?: WeeklyFeedback[];
  summarySemaphore: number;
  reports?: CourseReport[];
}
