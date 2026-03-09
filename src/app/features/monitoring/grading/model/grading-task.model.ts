import { GradingStepProgress } from './grading-progress.model';

export interface GradingTask {
  id: number;
  unitId: number;
  name: string;
  description?: string;
  order: number;
  steps: GradingStep[];
}

export interface GradingStep {
  id?: number;
  parentId?: number;
  order: number;
  code: string;
  name: string;
  submissionFormat: GradingSubmissionFormat;
  standards?: GradingStandard[];
  progress?: GradingStepProgress;
}

export interface GradingStandard {
  id: number;
  name: string;
  description: string;
  maxPoints: number;
  stepId: number;
}

export interface GradingSubmissionFormat {
  type: string;
  validationRule: string;
  guidelines: string;
}
