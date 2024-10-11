import { StepProgress } from "./step-progress";

export interface TaskProgress {
    id: number;
    learningTaskId: number;
    learnerId: number;
    status: string;
    stepProgresses?: StepProgress[];
}