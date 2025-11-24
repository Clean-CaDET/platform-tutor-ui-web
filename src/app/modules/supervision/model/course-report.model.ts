export interface CourseReport {
  courseId: number;
  learnerId: number;
  report: string;
  satisfiedUnitPercent: number;
  meaningfulReflectionAnswerPercent: number;
  unitReports?: UnitReport[];
  feedbackItemAggregates?: FeedbackItemAggregate[];
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