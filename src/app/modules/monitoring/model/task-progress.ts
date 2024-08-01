import { StepProgress } from "./step-progress";

export interface TaskProgress {
    id: number;
    status: string;
    order?: number;
    name?: string;
    stepProgresses?: StepProgress[];
    learningTaskId: number;
    learnerId: number;
}