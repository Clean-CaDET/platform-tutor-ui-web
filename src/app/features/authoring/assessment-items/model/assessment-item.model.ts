export interface AssessmentItemBase {
  id?: number;
  knowledgeComponentId: number;
  text: string;
  order: number;
  hints: string[];
}

export interface AuthoringMcq extends AssessmentItemBase {
  $type: 'multiChoiceQuestion';
  possibleAnswers: string[];
  correctAnswer: string;
  feedback: string;
}

export interface AuthoringMrqItem {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface AuthoringMrq extends AssessmentItemBase {
  $type: 'multiResponseQuestion';
  items: AuthoringMrqItem[];
}

export interface AuthoringSaq extends AssessmentItemBase {
  $type: 'shortAnswerQuestion';
  acceptableAnswers: string[];
  feedback: string;
  tolerance: number;
}

export type AuthoringAssessmentItem = AuthoringMcq | AuthoringMrq | AuthoringSaq;
