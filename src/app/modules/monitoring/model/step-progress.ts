import { StandardEvaluation } from "./standard-evaluation";

export interface StepProgress {
    id: number;
    taskProgressId: number;
    answer: string;
    status: string;
    stepId: number;
    evaluations?: StandardEvaluation[];
    comment?: string;
}