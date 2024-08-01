import { StandardEvaluation } from "./standard-evaluation";

export interface StepProgress {
    id: number;
    order?: number;
    name?: string;
    answer: string;
    status: string;
    stepId: number;
    evaluations?: StandardEvaluation[];
    comment?: string;
}