export interface Reflection {
  id: number;
  order: number;
  name: string;
  questions: ReflectionQuestion[];
  submissions?: ReflectionAnswer[];
}

export interface ReflectionQuestion {
  id: number;
  order: number;
  text: string;
  categoryId: number;
  categoryName?: string;
  type: ReflectionQuestionType;
  labels?: string[];

  answer?: string;
}

export enum ReflectionQuestionType {
  OpenEnded = 1,
  Slider
}

export interface ReflectionQuestionCategory {
  id: number;
  code: string;
  name: string;
}

export interface ReflectionAnswer {
  id?: number;
  learnerId?: number;
  reflectionId?: number;
  created?: string;
  answers: ReflectionQuestionAnswer[];
}

export interface ReflectionQuestionAnswer {
  questionId: number;
  answer: string;
}