export interface CourseReport {
  id: number;
  courseId: number;
  learnerId: number;
  report: string;
  satisfiedUnitPercent: number;
  meaningfulReflectionAnswerPercent: number;
  unitReports?: UnitReport[];
  feedbackItemAggregates?: FeedbackItemAggregate[];
  courseCode?: string;
  courseName?: string;
}

export interface UnitReport {
  unitId: number;
  unitName: string;
  order: number;
  isSatisfied: boolean;
  meaningfulReflections: MeaningfulReflection[];
  containsMeaningfulAnswer: boolean;
}

export interface FeedbackItemAggregate {
  code: string;
  weeks: number[];
  hasData: boolean;
  average: number;
  valueCounts: number[];
}

export interface MeaningfulReflection {
  reflectionId: number;
  created: string;
  question: string;
  answer: string;
}