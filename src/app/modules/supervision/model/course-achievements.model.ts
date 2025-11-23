import { WeeklyFeedback } from "../../monitoring/weekly-feedback/weekly-feedback.model";

export interface CourseAchievements {
  courseId: number;
  learnerId: number;
  report: string;
  totalSatisfiedPercent: number;
  totalMeaningfulReflectionAnswerPercent: number;
  unitAchievements: UnitAchievements[];
  weeklyFeedback: WeeklyFeedback[];
}

export interface UnitAchievements {
  unitId: number;
  unitName?: string;
  unitOrder?: number;
  isSatisfied: boolean;
  meaningfulReflections: MeaningfulReflection[];
  containsMeaningfulReflectionAnswer: boolean;
}

export interface MeaningfulReflection
{
  created: string;
  question: string;
  answer: string;
}