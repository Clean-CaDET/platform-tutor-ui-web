export interface Reflection {
  id: number;
  order: number;
  name: string;
  questions: ReflectionQuestion[];
  submissions?: ReflectionAnswer[];
  selectedLearnerSubmission?: ReflectionAnswer;
}

export interface ReflectionQuestion {
  id: number;
  order: number;
  text: string;
  category: number;
  categoryName?: string;
  type: ReflectionQuestionType;
  labels?: string[];

  answer?: string;
}

export enum ReflectionQuestionType {
  OpenEnded = 1,
  Slider
}

export interface ReflectionAnswer {
  id?: number;
  learnerId?: number;
  reflectionId?: number;
  created?: Date;
  answers: ReflectionQuestionAnswer[];
}

export interface ReflectionQuestionAnswer {
  questionId: number;
  answer: string;
}