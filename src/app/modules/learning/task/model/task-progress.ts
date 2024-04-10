import { StepProgress } from "./step-progress";

export interface TaskProgress {
    id?: number;
    totalScore: number;
    status: string;
    stepProgresses?: StepProgress[];
    learningTaskId: number;
    learnerId: number;
}