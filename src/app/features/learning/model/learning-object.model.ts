export interface TextLearningObject {
  $type: 'text';
  id: number;
  knowledgeComponentId: number;
  order: number;
  content: string;
}

export interface ImageLearningObject {
  $type: 'image';
  id: number;
  knowledgeComponentId: number;
  order: number;
  url: string;
  caption: string;
}

export interface VideoLearningObject {
  $type: 'video';
  id: number;
  knowledgeComponentId: number;
  order: number;
  url: string;
  caption: string;
}

export interface MultipleChoiceQuestion {
  $type: 'multiChoiceQuestion';
  id: number;
  knowledgeComponentId: number;
  order: number;
  text: string;
  possibleAnswers: string[];
  correctAnswer: string;
  feedback: string;
}

export interface MrqItem {
  text: string;
  isCorrect?: boolean;
  feedback?: string;
}

export interface MultipleResponseQuestion {
  $type: 'multiResponseQuestion';
  id: number;
  knowledgeComponentId: number;
  order: number;
  text: string;
  items: MrqItem[];
}

export interface ShortAnswerQuestion {
  $type: 'shortAnswerQuestion';
  id: number;
  knowledgeComponentId: number;
  order: number;
  text: string;
  acceptableAnswers: string[];
  feedback: string;
}

export type InstructionalItem = TextLearningObject | ImageLearningObject | VideoLearningObject;
export type AssessmentItem = MultipleChoiceQuestion | MultipleResponseQuestion | ShortAnswerQuestion;
export type LearningObject = InstructionalItem | AssessmentItem;

export function getVideoId(url: string): string {
  const parts = url.split('/');
  return parts.pop()!.slice(-11);
}
